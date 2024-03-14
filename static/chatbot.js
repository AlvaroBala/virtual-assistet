document.addEventListener('DOMContentLoaded', function() {
    // Selecting DOM elements
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const messageWindow = document.getElementById('message-window');
    const closeBtn = document.getElementById('close-btn');

    // Create typing indicator container and dots
    const typingIndicatorContainer = document.createElement('div');
    typingIndicatorContainer.id = 'typing-indicator-container';
    typingIndicatorContainer.className = 'typing-indicator';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingIndicatorContainer.appendChild(dot);
    }
    messageWindow.appendChild(typingIndicatorContainer);

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
                displayBotMessage("Hello our company provides assistance with water leaks, AC, locksmithing, and heater repairs. What can we help you with?");
                displayServiceSuggestions();
                isFirstTime = false; // Set to false so it doesn't show again
            }
        } else {
            chatContainer.style.display = 'none';
            chatToggle.style.display = 'block';
        }
    }

    // Function to display service suggestions
    function displayServiceSuggestions() {
        const suggestions = ["Locksmith", "Boilers", "AC Technician", "Plumber"];
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.id = 'service-suggestions';
        
        suggestions.forEach(function(suggestion) {
            const button = document.createElement('button');
            button.textContent = suggestion;
            button.classList.add('service-button');
            button.onclick = function() { handleServiceSelection(button); };
            suggestionsDiv.appendChild(button);
        });
        
        messageWindow.appendChild(suggestionsDiv);
        messageWindow.scrollTop = messageWindow.scrollHeight;
    }

    // Function to handle service selection
    function handleServiceSelection(selectedButton) {
        // Fetch and display professional information for the selected service
        fetchProfessional(selectedButton.textContent);
        
        // Hide all other buttons except the one clicked
        const buttonsContainer = document.getElementById('service-suggestions');
        Array.from(buttonsContainer.children).forEach(function(button) {
            if (button !== selectedButton) {
                button.style.display = 'none';
            }
        });
        
        // Optionally, style the selected button to indicate it's selected
        selectedButton.classList.add('selected-service-button');
    }

    // Function to simulate fetching professional info
    function fetchProfessional(serviceCategory) {
        // Endpoint where your REST API is listening
        const apiUrl = `/api/get_professional/${serviceCategory}`;
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Display the fetched professional's details
                displayBotMessage(`Contact ${data.name} at ${data.phone} for ${serviceCategory} services.`);
            })
            .catch(error => {
                // Handle any errors here
                console.error('There has been a problem with your fetch operation:', error);
                displayBotMessage('Sorry, I could not find a professional at the moment.');
            });
    }

    // Event listeners for toggle and close chat buttons
    chatToggle.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Functions to display user and bot messages
    function displayUserMessage(message) {
        const userDiv = document.createElement('div');
        userDiv.textContent = message;
        userDiv.classList.add('user-message');
        messageWindow.appendChild(userDiv);
        messageWindow.scrollTop = messageWindow.scrollHeight;
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

    // Function to send a message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            displayUserMessage(message);
            userInput.value = '';
            userInput.disabled = true; // Disable input during request
            showTypingIndicator(); // Show typing indicator
            // Simulate delay for bot response
            setTimeout(() => {
                // AJAX request to the server
                $.ajax({
                    type: 'POST',
                    url: '/chatbot', // Update this URL to your server endpoint
                    contentType: 'application/json',
                    data: JSON.stringify({ message: message }),
                    success: function(response) {
                        hideTypingIndicator(); // Hide typing indicator
                        displayBotMessage(response.response);
                        userInput.disabled = false; // Re-enable input
                        userInput.focus(); // Refocus on the input field after message is sent
                    },
                    error: function() {
                        hideTypingIndicator(); // Hide typing indicator
                        displayBotMessage("Sorry, I am having trouble responding right now.");
                        userInput.disabled = false; // Re-enable input
                        userInput.focus(); // Refocus on the input field even if there's an error
                    }
                });
            }, 1500); // Adjust this delay to match your bot's average response time
        }
    }

    // Function to display typing indicator
    function showTypingIndicator() {
        typingIndicatorContainer.style.display = 'flex';
        messageWindow.appendChild(typingIndicatorContainer);
        messageWindow.scrollTop = messageWindow.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicatorContainer.style.display = 'none';
        if (typingIndicatorContainer.parentNode === messageWindow) {
            messageWindow.removeChild(typingIndicatorContainer);
        }
    }
});
