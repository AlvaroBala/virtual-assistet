from flask import Flask, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

# Replace these with your MySQL database details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
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
    response = get_response_from_db(user_message)
    if not response:
        response = "I'm not sure how to answer that. Let's try searching for a professional."
    return jsonify({'response': response})

def get_response_from_db(user_message):
    conn = get_db_connection()
    response = None
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT answer FROM faqs WHERE question LIKE %s LIMIT 1", (f"%{user_message}%",))
        answer = cursor.fetchone()
        response = answer[0] if answer else None
        conn.close()
    return response

if __name__ == '__main__':
    app.run(debug=True)
