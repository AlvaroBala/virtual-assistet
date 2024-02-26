from flask import Flask, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

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
    conn = get_db_connection()
    if not conn:
        return "I'm currently unable to connect to the database."

    try:
        response = get_response_from_db(conn, user_message)
        if not response:
            response = get_response_from_keywords(conn, user_message)
        return response if response else "I'm not sure how to answer that. Let's try searching for a professional."
    finally:
        conn.close()

def get_response_from_db(conn, user_message):
    cursor = conn.cursor()
    query = "SELECT answer FROM faqs WHERE question LIKE %s LIMIT 1"
    cursor.execute(query, (f"%{user_message}%",))
    answer = cursor.fetchone()
    return answer[0] if answer else None

def get_response_from_keywords(conn, user_message):
    keywords = user_message.split()
    cursor = conn.cursor()
    for keyword in keywords:
        query = """
        SELECT faqs.answer
        FROM faq_keywords
        JOIN faqs ON faqs.id = faq_keywords.faq_id
        WHERE faq_keywords.keyword LIKE %s
        LIMIT 1
        """
        cursor.execute(query, (f"%{keyword}%",))
        answer = cursor.fetchone()
        if answer:
            return answer[0]
    return None

if __name__ == '__main__':
    app.run(port=5000)