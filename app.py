from flask import Flask, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
import spacy
import ssl
import os
import openai
from dotenv import load_dotenv
import smtplib
from collections import defaultdict 
from flask import Flask
from flask_cors import CORS  # type: ignore
load_dotenv()


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 


nlp = spacy.load("en_core_web_sm")

# MySQL database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password', 
    'database': 'virtual_assistent'
}

EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = int(os.getenv('EMAIL_PORT'))
EMAIL_ADDRESS = os.getenv('EMAIL_ADDRESS')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

openai.api_type = "azure"
openai.api_key = os.getenv("openai.api_key")
openai.api_base = os.getenv("openai.api_base")
openai.api_version = "2023-03-15-preview"
# Variable to store the current service category
current_category = None


@app.route('/proxy', methods=['POST'])
def proxy():
    external_api_url = 'https://crm-2.es/api/tecnicos-disponibles'
    json_data = request.get_json()
    postal_code = json_data.get('codigo_postal', 'default_postal_code') # Default value if not provided
    json_data['codigo_postal'] = postal_code

    response = requests.post(external_api_url, json=json_data, headers={
        'API-Key': '1954952eff1c76fbe2953b157502754fdbdcaffa',
        'Content-Type': 'application/json'
    })
    return jsonify(response.json())

@app.route('/custom_proxy', methods=['POST'])
def custom_proxy():
    # The external API URL you're sending the request to
    external_api_url = 'https://crm-2.es/api/api/oficios'

    # Extract the JSON data from the incoming POST request
    json_data = request.get_json()

    # Get 'oficio_id' and 'oficio_description' from the JSON data or set default values
    oficio_id = json_data.get('oficio_id', 'default_oficio_id')
    oficio_description = json_data.get('oficio_description', 'default_description')

    # Update the json_data with 'oficio_id' and 'oficio_description' if needed
    json_data['oficio_id'] = oficio_id
    json_data['oficio_description'] = oficio_description

    # Make a POST request to the external API with the JSON data and required headers
    response = requests.post(external_api_url, json=json_data, headers={
        'API-Key': '1954952eff1c76fbe2953b157502754fdbdcaffa',
        'Content-Type': 'application/json'
    })

    # Return the JSON response from the external API to the client
    return jsonify(response.json())
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

def send_email(to_address, client_details):
    print(client_details) 
    try:
        # Use a secure SSL context
        context = ssl.create_default_context()

        # Create a new message
        message = MIMEMultipart()
        message['From'] = EMAIL_ADDRESS
        message['To'] = to_address
        
        # Get service category from client details and set it as email subject
        service_category = client_details['serviceCategory']
        message['Subject'] = f'Request for: {service_category}'
        
        # Create the email body, including the description and postal code
        body = (f"Name: {client_details['name']}\n"
                f"Number: {client_details['number']}\n"
                f"Address: {client_details['address']}\n"
                f"Postal Code: {client_details['postcode']}\n"  # Use 'postcode' key instead of 'postalCode'
                f"Description: {client_details['description']}")
        message.attach(MIMEText(body, 'plain'))

        # Connect to the Gmail SMTP server and send the email
        with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT, context=context) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)  # Use your app-specific password here
            server.sendmail(EMAIL_ADDRESS, to_address, message.as_string())
        return "Tus datos fueron guardados."
    except Exception as e:
        print(f"Error sending email: {e}")
        return "Failed to send email."
    
def get_db_connection():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

# Common greetings and responses
greetings = {
    'hi': 'Hello! How can I assist you today?',
    'hello': 'Hi there! What can I do for you?',
    'hey': 'Hey! How can I help you?'
}

@app.route('/')
def index():
    return render_template('chatbot.html')

@app.route('/submit_client_details', methods=['POST'])
def submit_client_details():
    client_details = request.json
    email_status = send_email("vortexst109@gmail.com", client_details)
    return jsonify({'message': email_status})

@app.route('/chatbot', methods=['POST'])
def chatbot():
    global current_category
    user_message = request.json['message']
    response = ''

    # If the user's message is one of the service categories, store it
    if user_message.lower() in ["locksmith", "boilers", "ac technician", "plumber"]:
        current_category = user_message.lower()
        response = f'You selected {current_category}. How may I assist you with {current_category}?'
    else:
        response = get_response(user_message)
    
    return jsonify({'response': response})

def get_response(user_message):
    # Check for common greetings
    if user_message.lower() in greetings:
        return greetings[user_message.lower()]

    # Process the message with spaCy
    doc = nlp(user_message)
    # Extract keywords
    keywords = [token.text.lower() for token in doc if token.pos_ in ["NOUN", "VERB"] or token.ent_type_]

    # Handle short queries
    if not keywords:
        return "Can you please provide more details?"

    # Connect to the database
    conn = get_db_connection()
    if not conn:
        return "Unable to connect to the database."

    try:
        # Get a response using keywords
        response = get_response_from_keywords(conn, keywords)
        if response:
            return response
        else:
            # Query Azure OpenAI if no database response
            return query_azure_openai(user_message)
    finally:
        conn.close()

def get_response_from_keywords(conn, keywords):
    global current_category
    cursor = conn.cursor()
    answer_scores = defaultdict(int)

    # If a service category has been set, use it to filter the query
    if current_category:
        query = """
        SELECT f.id, f.answer
        FROM faqs f
        INNER JOIN ServiceCategories sc ON f.id = sc.question_id
        WHERE sc.category = %s AND fk.keyword LIKE %s
        """
    else:
        query = """
        SELECT f.id, f.answer
        FROM faqs f
        INNER JOIN faq_keywords fk ON f.id = fk.faq_id
        WHERE fk.keyword LIKE %s
        """

    for keyword in keywords:
        like_keyword = '%' + keyword + '%'
        if current_category:
            cursor.execute(query, (current_category, like_keyword))
        else:
            cursor.execute(query, (like_keyword,))
        faq_entries = cursor.fetchall()

        for entry in faq_entries:
            faq_id, _ = entry
            answer_scores[faq_id] += 1

    best_faq_id = max(answer_scores, key=answer_scores.get, default=None)
    if best_faq_id:
        answer_query = "SELECT answer FROM faqs WHERE id = %s"
        cursor.execute(answer_query, (best_faq_id,))
        best_answer = cursor.fetchone()
        if best_answer:
            return best_answer[0]
    return None

def query_azure_openai(query_text):
    try:
        response = openai.ChatCompletion.create(
            engine="chatgpt432k",
            messages=[{"role": "user", "content": query_text}],
            max_tokens=15000,
            temperature=0.5
        )
        return response.choices[0].message['content']
    except Exception as e:
        print(f"Error querying Azure OpenAI: {e}")
        return "Lo siento, no puedo dar una respuesta en este momento."

if __name__ == '__main__':
    app.run(port=5000)