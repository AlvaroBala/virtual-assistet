document.addEventListener('DOMContentLoaded', function() {
    // Selecting DOM elements
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const messageWindow = document.getElementById('message-window');
    const closeBtn = document.getElementById('close-btn');

    // Flag to track if the chat is opened for the first time
    let isFirstTime = true;

    // Function to toggle the chat window
    function toggleChat() {
        if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
            chatContainer.style.display = 'flex';
            chatToggle.style.display = 'none';
            userInput.focus(); // Focus on input field when chat opens

            // Display greeting message if it's the first time
            if (isFirstTime) {
                displayBotMessage("Hi, I'm your virtual assistant. How can I help you?");
                isFirstTime = false;
            }
        } else {
            chatContainer.style.display = 'none';
            chatToggle.style.display = 'block';
        }
    }

    // Event listeners for toggle and close chat buttons
    chatToggle.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Function to send a message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            displayUserMessage(message);
            userInput.value = '';
            userInput.disabled = true; // Disable input during request

            // AJAX request to the server
            $.ajax({
                type: 'POST',
                url: '/chatbot', // Update this URL to your server endpoint
                contentType: 'application/json',
                data: JSON.stringify({ message: message }),
                success: function(response) {
                    displayBotMessage(response.response);
                    userInput.disabled = false; // Re-enable input
                    userInput.focus(); // Refocus on the input field after message is sent
                },
                error: function() {
                    displayBotMessage("Sorry, I am having trouble responding right now.");
                    userInput.disabled = false; // Re-enable input
                    userInput.focus(); // Refocus on the input field even if there's an error
                }
            });
        }
    }

    // Functions to display user and bot messages
    function displayUserMessage(message) {
        const userDiv = document.createElement('div');
        userDiv.textContent = message;
        userDiv.classList.add('user-message');
        messageWindow.appendChild(userDiv);
        messageWindow.scrollTop = messageWindow.scrollHeight; // Auto-scroll to the latest message
    }

    function displayBotMessage(message) {
        const botDiv = document.createElement('div');
        botDiv.textContent = message;
        botDiv.classList.add('bot-message');
        messageWindow.appendChild(botDiv);
        messageWindow.scrollTop = messageWindow.scrollHeight;
    }

    // Event listener for send message button and enter key in input
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
