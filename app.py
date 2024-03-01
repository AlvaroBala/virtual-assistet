from flask import Flask, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error
import spacy
from collections import defaultdict

app = Flask(__name__)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# MySQL database details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'database': 'virtual_assistent'
}

# Connect to the database
def get_db_connection():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

# Common greetings and their responses
greetings = {
    'hi': 'Hello! How can I assist you today?',
    'hello': 'Hi there! What can I do for you?',
    'hey': 'Hey! How can I help you?'
}

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

# Function to get a response from the database using spaCy and keywords
def get_response(user_message):
    # Check for common greetings
    if user_message.lower() in greetings:
        return greetings[user_message.lower()]

    # Process the message with spaCy
    doc = nlp(user_message)
    # Extract keywords (nouns, verbs, named entities)
    keywords = [token.text.lower() for token in doc if token.pos_ in ["NOUN", "VERB"] or token.ent_type_]

    # Handle short queries with no informative content
    if not keywords:
        return "Can you please provide more details so I can assist you better?"

    # Connect to the database
    conn = get_db_connection()
    if not conn:
        return "I'm currently unable to connect to the database."

    try:
        # Get a response using the extracted keywords
        response = get_response_from_keywords(conn, keywords)
        return response if response else "I'm not sure how to answer that. Let's try searching for a professional."
    finally:
        conn.close()

# Function to query the database based on the extracted keywords
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
    if best_faq_id is not None:
        answer_query = "SELECT answer FROM faqs WHERE id = %s"
        cursor.execute(answer_query, (best_faq_id,))
        best_answer = cursor.fetchone()
        if best_answer:
            return best_answer[0]

    return "I'm not sure how to answer that. Can you please provide more details?"

if __name__ == '__main__':
    app.run(port=5000)
