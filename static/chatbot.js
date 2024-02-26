document.addEventListener('DOMContentLoaded', function() {
    
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const messageWindow = document.getElementById('message-window');

    chatToggle.addEventListener('click', function() {
        chatContainer.style.display = 'flex';
        chatToggle.style.display = 'none';
        userInput.focus(); // Focus on the input field when chat opens
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
            displayUserMessage(message);
            userInput.value = '';
            userInput.disabled = true; // Disable input during request

            $.ajax({
                type: 'POST',
                url: '/chatbot', // Update to match the route in your Flask app
                contentType: 'application/json',
                data: JSON.stringify({ message: message }),
                success: function(response) {
                    displayBotMessage(response.response);
                    userInput.disabled = false; // Re-enable input
                    userInput.focus(); // Focus back on the input field
                },
                error: function() {
                    displayBotMessage("Sorry, I am having trouble responding right now.");
                    userInput.disabled = false; // Re-enable input
                }
            });
        }
    }

    function displayUserMessage(message) {
        const userDiv = document.createElement('div');
        userDiv.textContent = message;
        userDiv.classList.add('user-message');
        messageWindow.appendChild(userDiv);
        messageWindow.scrollTop = messageWindow.scrollHeight; // Scroll to the bottom
    }

    function displayBotMessage(message) {
        const botDiv = document.createElement('div');
        botDiv.textContent =  message;
        botDiv.classList.add('bot-message');
        messageWindow.appendChild(botDiv);
        messageWindow.scrollTop = messageWindow.scrollHeight; // Scroll to the bottom
    }
    
});
