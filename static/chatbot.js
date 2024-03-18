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
        selectedService = selectedButton.textContent;
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
        const apiUrl = `/api/get_professional/${serviceCategory}`;
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                displayBotMessage(`Contact ${data.name} at ${data.phone} for ${serviceCategory} services.`);
                askForClientDetails(); // Moved to a separate function for clarity.
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                displayBotMessage('Sorry, I could not find a professional at the moment.');
                askForClientDetails(); // Ask for details even if there is an error.
            });
    }
    
    function askForClientDetails() {
        displayBotMessage("Please provide your details.", true);
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

    function displayBotMessage(message, askForDetails = false) {
        const botDiv = document.createElement('div');
        botDiv.textContent = message;
        botDiv.classList.add('bot-message');
        messageWindow.appendChild(botDiv);

        if (askForDetails) {
            addClientDetailInputs();
        }

        messageWindow.scrollTop = messageWindow.scrollHeight;
    }
    function addClientDetailInputs() {
        const inputFields = ['Name', 'Number', 'Address', 'Description']; // Add 'Description' to the list
        const inputContainer = document.createElement('div');
        inputContainer.id = 'client-detail-inputs';
        inputContainer.className = 'client-details-container'; // Added class for styling
    
        inputFields.forEach(field => {
            const inputWrapper = document.createElement('div');
            inputWrapper.className = 'input-wrapper';
    
            const label = document.createElement('label');
            label.textContent = `${field}:`;
            label.htmlFor = `client-${field.toLowerCase()}`;
            label.className = 'inline-label';
    
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `client-${field.toLowerCase()}`;
            input.name = field.toLowerCase();
            input.className = 'inline-input';
            input.placeholder = `Your ${field.toLowerCase()}`;
            input.required = true; // Make the input non-nullable (required)
    
            // If the field is 'Description', change its type to 'textarea' for multi-line input
            if (field === 'Description') {
                const textarea = document.createElement('textarea');
                textarea.id = `client-${field.toLowerCase()}`;
                textarea.name = field.toLowerCase();
                textarea.className = 'inline-textarea';
                textarea.placeholder = `Your ${field.toLowerCase()}`;
                textarea.required = true; // Make the textarea non-nullable (required)
                inputWrapper.appendChild(label);
                inputWrapper.appendChild(textarea);
            } else {
                inputWrapper.appendChild(label);
                inputWrapper.appendChild(input);
            }
    
            inputContainer.appendChild(inputWrapper);
        });
    
        // Add a submit button to the container
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Details';
        submitButton.className = 'submit-details-button';
        submitButton.onclick = submitClientDetails;
    
        inputContainer.appendChild(submitButton);
        messageWindow.appendChild(inputContainer);
    }
    
    
    // Adding an event listener for validation feedback
    submitButton.addEventListener('click', function(event) {
        inputFields.forEach(field => {
            const input = document.getElementById(`client-${field.toLowerCase()}`);
            if (!input.value) {
                input.className += ' input-error'; // Update class to show error
            }
        });
    });

    inputContainer.appendChild(submitButton);
    messageWindow.appendChild(inputContainer);

    // Optional: animate the container for a better user experience
    inputContainer.style.opacity = 0;
    setTimeout(() => inputContainer.style.opacity = 1, 100);


    // Function to submit client details
    // Function to submit client details
    function submitClientDetails() {
        const clientDetails = {
            name: document.getElementById('client-name').value,
            number: document.getElementById('client-number').value,
            address: document.getElementById('client-address').value,
            description: document.getElementById('client-description').value,
            serviceCategory: selectedService  // Include the selected service category
        };
    // Ensure all fields are filled out before sending
    for (let key in clientDetails) {
        if (clientDetails[key].trim() === '') {
            displayBotMessage(`Please fill out the ${key} field.`);
            return;
        }
    }

    // AJAX request to send data to the server
    $.ajax({
        type: 'POST',
        url: '/submit_client_details',
        contentType: 'application/json',
        data: JSON.stringify(clientDetails),
        success: function(response) {
            displayBotMessage(response.message);
        },
        error: function() {
            displayBotMessage("Sorry, there was an error processing your details.");
        }
    });

    // Remove the input fields after submission
    const inputContainer = document.getElementById('client-detail-inputs');
    inputContainer.parentNode.removeChild(inputContainer);
}

    // Modify the sendMessage function to handle the client detail input case
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            const clientDetailInputs = document.getElementById('client-detail-inputs');
            if (clientDetailInputs) {
                return; // Do not proceed with usual message sending if in client detail input mode
            }

            // Existing sendMessage logic...
            // ...
        }
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
