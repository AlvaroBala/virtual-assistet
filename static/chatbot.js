// chatbot.js
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const messageWindow = document.getElementById('message-window');

    chatToggle.addEventListener('click', function() {
        chatContainer.style.display = 'flex';
        chatToggle.style.display = 'none';
    });

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', function(e) {
        if (e.which === 13) { // Enter key is pressed
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            const userDiv = document.createElement('div');
            userDiv.textContent = 'You: ' + message;
            userDiv.classList.add('user-message');
            messageWindow.appendChild(userDiv);

            // Here you would send the message to the server and get a response
            // For now, let's just echo the user message
            const botDiv = document.createElement('div');
            botDiv.textContent = 'Bot: ' + message;
            botDiv.classList.add('bot-message');
            messageWindow.appendChild(botDiv);

            userInput.value = '';
            messageWindow.scrollTop = messageWindow.scrollHeight; // Scroll to the bottom
        }
    }
});
