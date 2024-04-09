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

            if (isFirstTime) {
                displayBotMessage("Hola, seleccione uno de los botones a continuación relacionados con su problema, complete sus datos y le daremos el contacto de uno de nuestros técnicos.");
                displayServiceOptions(); // Ensure this is called instead of displayServiceSuggestions
                isFirstTime = false;
            }
        } else {
            chatContainer.style.display = 'none';
            chatToggle.style.display = 'block';
        }
    }
    // Function to display service suggestions
    // function displayServiceSuggestions() {
    //     const suggestions = ["Cerrajero", "Calderas", "Aire Acondicionado", "Fontanero", "Calefacción", "Persianas"];
    //     const suggestionsDiv = document.createElement('div');
    //     suggestionsDiv.id = 'service-suggestions';
        
    //     suggestions.forEach(function(suggestion) {
    //         const button = document.createElement('button');
    //         button.textContent = suggestion;
    //         button.classList.add('service-button');
    //         button.onclick = function() { handleServiceSelection(button); };
    //         suggestionsDiv.appendChild(button);
    //     });
        
    //     messageWindow.appendChild(suggestionsDiv);
    //     messageWindow.scrollTop = messageWindow.scrollHeight;
    // }
    let selectedServiceCategory = '';

    function displayServiceOptions() {
        // CORS proxy URL
        const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
        // API endpoint
        const API_URL = `${PROXY_URL}https://crm-2.es/api/oficios`;
    
        // Headers including the API Key
        const headers = {
            'API-Key': '1954952eff1c76fbe2953b157502754fdbdcaffa'
        };
    
        // Fetching data using the CORS proxy
        fetch(API_URL, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(oficios => {
            // Remove the previous dropdown if it exists
            const existingDropdown = document.getElementById('service-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
            }
    
            // Check if data is valid and has items
            if (oficios && oficios.length > 0) {
                // Create and append the dropdown with actual data
                const dropdown = createServiceDropdown(oficios);
                messageWindow.appendChild(dropdown);
                messageWindow.scrollTop = messageWindow.scrollHeight;
            } else {
                // Handle the case when the API returns an empty list
                console.error('The API returned an empty list of oficios.');
                displayBotMessage('Lo sentimos, no hay servicios disponibles en este momento.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    
    
    function displayBotMessage(message) {
        const botDiv = document.createElement('div');
        botDiv.textContent = message;
        botDiv.classList.add('bot-message');
        messageWindow.appendChild(botDiv);
        messageWindow.scrollTop = messageWindow.scrollHeight;
    }
    
    function createServiceDropdown(oficios) {
        const select = document.createElement('select');
        select.id = 'service-dropdown';
        select.className = 'service-dropdown';
    
        // No default option appended here
    
        // Populate dropdown with options
        oficios.forEach(oficio => {
            const option = document.createElement('option');
            option.value = oficio.oficio_id;
            option.textContent = oficio.oficio_descripcion;
            select.appendChild(option);
        });
    
        // Event listener for selection
        select.addEventListener('change', handleServiceSelection);
        return select;
    }
    function initializeServiceSelection() {
    displayBotMessage("Hola, por favor seleccione un servicio de la lista:");
    displayServiceOptions(); // This function should append the dropdown and call initializeDropdownSearch
    }

    initializeServiceSelection(); // Call this at the appropriate time to set up your chat interface
    
    
    
    // Call this function where you want to display the message and the dropdown
    function initializeServiceSelection() {
        // Display a bot message above the dropdown
        displayBotMessage("Hola, seleccione uno de los servicios de la lista.");
    
        // Then display the dropdown below the message
        displayServiceOptions(); // Make sure this function calls createServiceDropdown and initializeDropdownSearch
    }
    
   

    // Function to handle service selection
    function handleServiceSelection() {
        const dropdown = document.getElementById('service-dropdown');
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        
        if (selectedOption && selectedOption.value) {
            selectedServiceCategory = selectedOption.text;
            selectedOficioId = selectedOption.value; // Store the selected oficio_id globally
            askForClientDetails(); // You can call fetchProfessional here or elsewhere depending on your flow
        }
   
    }
    let selectedOficioId = null;

    function fetchProfessional(postalCode) {
        // Make sure to validate postalCode and selectedOficioId before using them
        // Validate the postalCode, for example, check if it's a string and not empty
        if (!postalCode || typeof postalCode !== 'string') {
            console.error('Invalid postal code');
            displayBotMessage('El código postal proporcionado no es válido.');
            return;
        }

        // Validate the selectedOficioId, for example, check if it's not null
        if (!selectedOficioId) {
            console.error('No service has been selected');
            displayBotMessage('No se ha seleccionado ningún servicio.');
            return;
        }

        // Prepare the API URL and options for the fetch call
        const apiUrl = '/proxy'; // The endpoint in your Flask app that acts as a proxy
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigo_postal: postalCode,
                oficio_id: selectedOficioId // Use the selected oficio_id from the dropdown
            })
        };

        // Perform the fetch call to the proxy endpoint
        fetch(apiUrl, fetchOptions)
        .then(response => {
            // Check if the response from the proxy is ok (status in the range 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            // Parse the response as JSON
            return response.json();
        })
        .then(data => {
            // Check if the API response has technicians data
            if (data && data.length > 0) {
                // Pick a random technician from the list
                const randomIndex = Math.floor(Math.random() * data.length);
                const technician = data[randomIndex];
                // Construct a message with the technician's information
                const contactInfo = `Contacte a ${technician.tecnico_nombre} en el teléfono ${technician.tecnico_telefono} para servicios de ${selectedServiceCategory}.`;
                // Display the technician's contact info in the chatbot
                displayBotMessage(contactInfo);
            } else {
                // If no technicians are found, inform the user
                displayBotMessage('Lo sentimos, no pudimos encontrar un técnico en este momento.');
            }
        })
        .catch(error => {
            // Log and inform the user of any errors during the fetch call
            console.error('Hubo un problema con la operación fetch:', error);
            displayBotMessage('Lo sentimos, no pudimos encontrar un técnico en este momento.');
        });
    }


    
    function askForClientDetails() {
        const detailMessage = displayBotMessage("Por favor proporcione sus datos.", true);
        detailMessage.id = 'detail-message';
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
        return botDiv; // Return the created div
    }
    function addClientDetailInputs() {
        const inputFields = [
            { id: 'name', labelText: 'Nombre' },
            { id: 'number', labelText: 'Número' },
            { id: 'address', labelText: 'Dirección' },
            { id: 'postcode', labelText: 'Código Postal' }, // Added postcode field
            { id: 'description', labelText: 'Descripción' }
        ];
        const inputContainer = document.createElement('div');
        inputContainer.id = 'client-detail-form';
        inputContainer.className = 'client-details-container';
    
        inputFields.forEach(field => {
            const inputWrapper = document.createElement('div');
            inputWrapper.className = 'input-wrapper';
    
            const label = document.createElement('label');
            label.textContent = field.labelText + ':';
            label.className = 'inline-label';
            label.htmlFor = 'client-' + field.id;
    
            let inputElement;
            if (field.id === 'description') {
                inputElement = document.createElement('textarea');
                inputElement.placeholder = 'Por favor describa su problema'; // Placeholder in Spanish
            } else {
                inputElement = document.createElement('input');
                inputElement.type = (field.id === 'number') ? 'tel' : 'text';
            }
            inputElement.id = 'client-' + field.id;
            inputElement.name = field.id;
            inputElement.className = 'chatbot-input';
            inputElement.required = true;
    
            inputWrapper.appendChild(label);
            inputWrapper.appendChild(inputElement);
            inputContainer.appendChild(inputWrapper);
        });
    
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Enviar Detalles';
        submitButton.className = 'chatbot-submit-button';
        submitButton.type = 'button';
        submitButton.onclick = submitClientDetails;
    
        inputContainer.appendChild(submitButton);
        messageWindow.appendChild(inputContainer);
    }

    // Function to submit client details
    let selectedServiceId = null;

    function submitClientDetails() {
        // Validation to check if all form fields are filled
        if (!document.getElementById('client-name').value || 
            !document.getElementById('client-number').value || 
            !document.getElementById('client-address').value || 
            !document.getElementById('client-postcode').value || 
            !document.getElementById('client-description').value) {
            displayBotMessage("Por favor complete todos los detalles antes de enviar.");
            return;
        }
    
        const clientDetails = {
            name: document.getElementById('client-name').value,
            number: document.getElementById('client-number').value,
            address: document.getElementById('client-address').value,
            postcode: document.getElementById('client-postcode').value,
            description: document.getElementById('client-description').value,
            serviceCategory: selectedServiceCategory // You already have this value from dropdown
        };
    
        // AJAX request to send data to server
        $.ajax({
            type: 'POST',
            url: '/submit_client_details',
            contentType: 'application/json',
            data: JSON.stringify(clientDetails),
            success: function(response) {
                displayBotMessage(response.message);
                removeClientDetailForm();
                // Now, call fetchProfessional with both the postcode and selectedServiceId
                fetchProfessional(clientDetails.postcode, selectedServiceId);
            },
            error: function() {
                displayBotMessage("Lo sentimos, hubo un error al procesar tus datos.");
            }
        });
    }

    function removeClientDetailForm() {
        const form = document.getElementById('client-detail-form');
        const detailMessage = document.getElementById('detail-message');
    
        if (form) {
            form.parentNode.removeChild(form);
        }
    
        if (detailMessage) {
            detailMessage.parentNode.removeChild(detailMessage);
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
    // At the end of chatbot.js
    displayServiceOptions(); // Call it manually to check if the dropdown appears
    
});