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

    let selectedServiceCategory = '';

    function displayServiceOptions() {
        // New API endpoint
        const API_URL = 'https://crm-2.es/api/professions';
    
        // Headers including the API Key
        const headers = {
            'API-Key': '1954952eff1c76fbe2953b157502754fdbdcaffa'
        };
    
        // Fetching data directly from the new API endpoint
        fetch(API_URL, { headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(professions => {
                if (professions && professions.length > 0) {
                    // Call the function to create a new searchable dropdown
                    createSearchableDropdown(professions);
                } else {
                    console.error('The API returned an empty list of professions.');
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
    function showClientDetailForm() {
        // Clear existing form if it exists
        removeClientDetailForm();
    
        // Display the form
        askForClientDetails();
    }
    
    let selectedOficioId = '';

    

    function createSearchableDropdown(professions) {
        // Remove any existing dropdown container first
        const existingContainer = document.querySelector('.dropdown-container');
        if (existingContainer) {
            existingContainer.remove();
        }
    
        // Create a new container for the dropdown
        const container = document.createElement('div');
        container.className = 'dropdown-container';
    
        // Create a search input element
        const searchInput = document.createElement('input');
        searchInput.placeholder = 'Search...';
        searchInput.className = 'search-dropdown';
        container.appendChild(searchInput);
    
        // Create a search icon and append it to the container
        const searchIcon = document.createElement('span');
        searchIcon.className = 'search-icon fa fa-search';
        container.appendChild(searchIcon);
    
        // Create a clear button and append it to the container
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-btn';
        clearButton.textContent = 'Claro';
        clearButton.type = 'button';
        container.appendChild(clearButton);
    
        // Event listener for the clear button
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            filterDropdown();
        });
    
        // Create a dropdown element
        const dropdown = document.createElement('select');
        dropdown.id = 'service-dropdown';
        dropdown.size = 5; // This will be overridden by CSS if you want to always show a scrollbar
        container.appendChild(dropdown);
    
        // Define a function to filter the dropdown based on the search input
        function filterDropdown() {
            const searchTerm = searchInput.value.toLowerCase();
            dropdown.innerHTML = ''; // Clear previous options
    
            // Filter professions based on the search term and populate the dropdown
            const filteredProfessions = professions.filter(profession =>
                profession.oficio_descripcion.toLowerCase().includes(searchTerm)
            );
    
            // Populate the dropdown with filtered professions
            filteredProfessions.forEach(profession => {
                const option = document.createElement('option');
                option.value = profession.oficio_id;
                option.textContent = profession.oficio_descripcion;
                dropdown.appendChild(option);
            });
        }
    
        // Add an event listener to the search input to filter the dropdown as the user types
        searchInput.addEventListener('input', filterDropdown);
    
        // Add a change event listener to the dropdown to handle when an option is selected
        dropdown.addEventListener('change', function() {
            // This assumes you have a global variable to store the selected service category
            selectedServiceCategory = this.options[this.selectedIndex].textContent;
            selectedOficioId = this.value;
    
            // Assuming you have a function to handle showing the form for the selected service
            showClientDetailForm(); // This function should handle displaying the client detail form
        });
    
        // Initialize the dropdown with all professions
        filterDropdown();
    
        // Append the container to the message window and adjust its scroll
        messageWindow.appendChild(container);
        messageWindow.scrollTop = messageWindow.scrollHeight;
    }

    function initializeServiceSelection() {
    displayServiceOptions(); // This function should append the dropdown and call initializeDropdownSearch
    }

    initializeServiceSelection(); // Call this at the appropriate time to set up your chat interface
    
    
    
    // Call this function where you want to display the message and the dropdown
    function initializeServiceSelection() {
        // Show welcome message only if it's the first time opening the chat
        if (isFirstTime) {
            displayBotMessage("Hola, seleccione uno de los botones a continuación relacionados con su problema, complete sus datos y le daremos el contacto de uno de nuestros técnicos.");
            isFirstTime = false; // Prevent message from showing again
        }
        displayServiceOptions(); // Call this to display services
    }
    
    // Call this at the appropriate time to set up your chat interface
    initializeServiceSelection();
    
   

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

    function fetchProfessional(postalCode, callback) {
        const apiUrl = `https://crm-2.es/api/technicians/available?codigo_postal=${encodeURIComponent(postalCode)}&oficio_id=${encodeURIComponent(selectedOficioId)}`;
        const fetchOptions = {
            method: 'GET',
            headers: {
                'API-Key': '1954952eff1c76fbe2953b157502754fdbdcaffa',
            }
        };
    
        fetch(apiUrl, fetchOptions)
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            const technician = data[Math.floor(Math.random() * data.length)];
            callback(technician);
            // Construct a message with the technician's information
            const contactInfo = `Contacte a ${technician.tecnico_nombre} en el teléfono ${technician.tecnico_telefono} para servicios de ${selectedServiceCategory}.`;
            // Display the technician's contact info in the chatbot
            displayBotMessage(contactInfo);
            hideTypingIndicator(); // Hide the typing indicator
        } else {
            // If no technicians are found, inform the user
            displayBotMessage('Lo sentimos, no hay técnicos disponibles en este momento.');
            callback(null);
            hideTypingIndicator(); // Hide the typing indicator
        }
    })
    .catch(error => {
        console.error('Error fetching technician:', error);
        displayBotMessage('Lo sentimos, hubo un error al buscar técnicos disponibles.');
        callback(null);
        hideTypingIndicator(); // Hide the typing indicator
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
        const clientDetails = {
            name: document.getElementById('client-name').value,
            number: document.getElementById('client-number').value,
            address: document.getElementById('client-address').value,
            postcode: document.getElementById('client-postcode').value,
            description: document.getElementById('client-description').value,
            serviceCategory: selectedServiceCategory
        };
    
        fetchProfessional(clientDetails.postcode, function(technician) {
            if (technician) {
                clientDetails.technicianName = technician.tecnico_nombre;
                clientDetails.technicianPhone = technician.tecnico_telefono;
            } else {
                clientDetails.technicianName = 'Not available';
                clientDetails.technicianPhone = 'Not available';
            }
    
            $.ajax({
                type: 'POST',
                url: '/submit_client_details',
                contentType: 'application/json',
                data: JSON.stringify(clientDetails),
                success: function(response) {
                    
                    removeClientDetailForm();
                },
                error: function() {
                    displayBotMessage("Sorry, there was an error processing your details.");
                }
            });
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
    const typingIndicator = document.getElementById('typing-indicator-container');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}
    // At the end of chatbot.js
    displayServiceOptions(); // Call it manually to check if the dropdown appears
    
});