from flask import Flask, request, jsonify
from transformers import BertForQuestionAnswering, BertTokenizer
import torch

# Initialize Flask application
api_app = Flask(__name__)

# Load pre-trained BERT model and tokenizer
# Ensure you have downloaded the model and tokenizer or adjust the model name to one you have downloaded.
model_name = 'bert-large-uncased-whole-word-masking-finetuned-squad'
model = BertForQuestionAnswering.from_pretrained(model_name)
tokenizer = BertTokenizer.from_pretrained(model_name)

@api_app.route('/generate-answer', methods=['POST'])
def generate_answer():
    # Extract data from POST request
    data = request.get_json()
    question = data.get('question')
    context = data.get('context')  # You need to provide context for BERT to find the answer

    # Tokenize input for BERT
    inputs = tokenizer.encode_plus(question, context, add_special_tokens=True, return_tensors='pt')
    
    # Get model output
    input_ids = inputs['input_ids'].tolist()[0]
    text_tokens = tokenizer.convert_ids_to_tokens(input_ids)
    answer_start_scores, answer_end_scores = model(**inputs)
    
    # Find the position tokens with the highest `start` and `end` scores
    answer_start = torch.argmax(answer_start_scores)
    answer_end = torch.argmax(answer_end_scores) + 1

    # Convert tokens to the answer string
    answer = tokenizer.convert_tokens_to_string(text_tokens[answer_start:answer_end])

    return jsonify({'answer': answer})

if __name__ == '__main__':
    api_app.run(debug=True, port=5001)
