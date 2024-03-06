from flask import Flask, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error
import spacy
from collections import defaultdict
import os
import openai

# Initialize Flask app
app = Flask(__name__)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# MySQL database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'database': 'virtual_assistent'
}


openai.api_type = "azure"
openai.api_key = os.getenv('OPENAI_API_KEY')
openai.api_base = os.getenv('OPENAI_API_BASE')
openai.api_version = "2023-03-15-preview"

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

# Route for the index page
@app.route('/')
def index():
    return render_template('index.html')

# Route for chatbot responses
@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json['message']
    response = get_response(user_message)
    return jsonify({'response': response})

# Function to get a response
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

# Function to get response from database using keywords
def get_response_from_keywords(conn, keywords):
    cursor = conn.cursor()
    answer_scores = defaultdict(int)

    for keyword in keywords:
        query = """
        SELECT f.id, f.answer
        FROM faqs f
        INNER JOIN faq_keywords fk ON f.id = fk.faq_id
        WHERE fk.keyword LIKE %s
        """
        like_keyword = f"%{keyword}%"
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
        return "Sorry, I can't provide an answer at the moment."

if __name__ == '__main__':
    app.run(port=5000)
