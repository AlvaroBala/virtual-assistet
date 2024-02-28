from flask import Flask, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error
import spacy

app = Flask(__name__)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# MySQL database details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'database': 'virtual_assistant'
}

# Connect to the database
def get_db_connection():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

# Route for serving the webpage
@app.route('/')
def index():
    return render_template('index.html')

# Route for handling AJAX requests
@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json['message']
    response = get_response(user_message)
    return jsonify({'response': response})

# Function to get a response from the database
def get_response(user_message):
    # Process the message with spaCy
    doc = nlp(user_message)
    # Extract keywords (could be nouns, verbs, or named entities)
    keywords = [token.text for token in doc if token.is_alpha and not token.is_stop]
    
    # Connect to the database
    conn = get_db_connection()
    if not conn:
        return "I'm currently unable to connect to the database."

    try:
        # Try getting a response using spaCy extracted keywords
        response = get_response_from_keywords(conn, keywords)
        return response if response else "I'm not sure how to answer that. Let's try searching for a professional."
    finally:
        conn.close()

def get_response_from_keywords(conn, keywords):
    cursor = conn.cursor()
    # Modify your query to search for all keywords
    query = """
    SELECT faqs.answer
    FROM faq_keywords
    JOIN faqs ON faqs.id = faq_keywords.faq_id
    WHERE """
    query += ' OR '.join(f"faq_keywords.keyword LIKE %s" for _ in keywords)
    cursor.execute(query, tuple(f"%{keyword}%" for keyword in keywords))
    answer = cursor.fetchone()
    return answer[0] if answer else None

if __name__ == '__main__':
    app.run(port=5000)
