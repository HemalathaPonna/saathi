document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const languageSelectScreen = document.getElementById('language-select-screen');
    const chatInterfaceContainer = document.getElementById('chat-interface-container');
    const languageCards = document.querySelectorAll('.language-card');
    const chatContainer = document.getElementById('chat-container');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const inputArea = document.getElementById('input-area');
    const optionArea = document.getElementById('option-area');

    // State Variables
    let selectedLanguage = 'e';
    let currentStep = 0;
    const registrationData = {};

    // Chat Flow and Translations
    const allPrompts = {
        'e': [
            { type: 'text', message: "Hello there! I'm your Saathi guide. What's your full name?", key: 'name', validate: (input) => input.trim().length > 0, error: "Please enter a valid name." },
            { type: 'options', message: "Which city are you located in? Please select from the options below:", key: 'city', options: ['Patna', 'Jaipur', 'Bengaluru', 'Hyderabad', 'Chennai'], validate: (input) => ['patna', 'jaipur', 'bengaluru', 'hyderabad', 'chennai'].includes(input.toLowerCase()) },
            { type: 'options', message: "What kind of services can you provide? You can select multiple.", key: 'services', options: ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mechanic'], validate: (input) => input.trim().length > 0 },
            { type: 'text', message: "Great! Please provide your phone number so we can reach you. (e.g., +91XXXXXXXXXX)", key: 'phone', validate: (input) => /^\+91\d{10}$/.test(input.trim()), error: "Please enter a valid phone number in the format +91XXXXXXXXXX." }
        ],
        'h': [
            { type: 'text', message: "नमस्ते! मैं आपका साथी हूं। आपका पूरा नाम क्या है?", key: 'name', validate: (input) => input.trim().length > 0, error: "कृपया एक वैध नाम दर्ज करें।" },
            { type: 'options', message: "आप किस शहर में रहते हैं? कृपया नीचे दिए गए विकल्पों में से चुनें:", key: 'city', options: ['पटना', 'जयपुर', 'बेंगलुरु', 'हैदराबाद', 'चेन्नई'], validate: (input) => ['पटना', 'जयपुर', 'बेंगलुरु', 'हैदराबाद', 'चेन्नई'].includes(input) },
            { type: 'options', message: "आप किस प्रकार की सेवाएं प्रदान कर सकते हैं?", key: 'services', options: ['प्लंबर', 'इलेक्ट्रीशियन', 'बढ़ई', 'पेंटर', 'मैकेनिक'], validate: (input) => input.trim().length > 0 },
            { type: 'text', message: "बहुत अच्छा! कृपया अपना फ़ोन नंबर प्रदान करें ताकि हम आपसे संपर्क कर सकें। (उदा. +91XXXXXXXXXX)", key: 'phone', validate: (input) => /^\+91\d{10}$/.test(input.trim()), error: "कृपया +91XXXXXXXXXX प्रारूप में एक वैध फ़ोन नंबर दर्ज करें।" }
        ],
        't': [
            { type: 'text', message: "హలో! నేను మీ సాతీ గైడ్. మీ పూర్తి పేరు ఏమిటి?", key: 'name', validate: (input) => input.trim().length > 0, error: "దయచేసి చెల్లుబాటు అయ్యే పేరును నమోదు చేయండి." },
            { type: 'options', message: "మీరు ఏ నగరంలో ఉన్నారు? దయచేసి క్రింది ఎంపికల నుండి ఎంచుకోండి:", key: 'city', options: ['పట్నా', 'జైపూర్', 'బెంగుళూరు', 'హైదరాబాద్', 'చెన్నై'], validate: (input) => ['పట్నా', 'జైపూర్', 'బెంగుళూరు', 'హైదరాబాద్', 'చెన్నై'].includes(input) },
            { type: 'options', message: "మీరు ఏ రకమైన సేవలను అందించగలరు?", key: 'services', options: ['ప్లంబర్', 'ఎలక్ట్రీషియన్', 'కార్పెంటర్', 'పెయింటర్', 'మెకానిక్'], validate: (input) => input.trim().length > 0 },
            { type: 'text', message: "చాలా బాగుంది! దయచేసి మీ ఫోన్ నంబర్‌ను అందించండి, తద్వారా మేము మిమ్మల్ని సంప్రదించగలము. (ఉదాహరణకు, +91XXXXXXXXXX)", key: 'phone', validate: (input) => /^\+91\d{10}$/.test(input.trim()), error: "దయచేసి +91XXXXXXXXXX ఫార్మాట్‌లో చెల్లుబాటు అయ్యే ఫోన్ నంబర్‌ను నమోదు చేయండి." }
        ],
        'a': [
            { type: 'text', message: "வணக்கம்! நான் உங்கள் சாத்தி வழிகாட்டி. உங்கள் முழுப் பெயர் என்ன?", key: 'name', validate: (input) => input.trim().length > 0, error: "சரியான பெயரை உள்ளிடவும்." },
            { type: 'options', message: "நீங்கள் எந்த நகரத்தில் உள்ளீர்கள்? கீழே உள்ள விருப்பங்களிலிருந்து தேர்ந்தெடுக்கவும்:", key: 'city', options: ['பாட்னா', 'ஜெய்ப்பூர்', 'பெங்களூரு', 'ஹைதராபாத்', 'சென்னை'], validate: (input) => ['பாட்னா', 'ஜெய்ப்பூர்', 'பெங்களூரு', 'ஹைதராபாத்', 'சென்னை'].includes(input) },
            { type: 'options', message: "நீங்கள் எந்த வகையான சேவைகளை வழங்க முடியும்?", key: 'services', options: ['பிளம்பர்', 'எலக்ட்ரீஷியன்', 'தச்சர்', 'வண்ணப்பூச்சாளர்', 'மெக்கானிக்'], validate: (input) => input.trim().length > 0 },
            { type: 'text', message: "அருமை! நாங்கள் உங்களைத் தொடர்புகொள்ள உங்கள் தொலைபேசி எண்ணை வழங்கவும். (உதாரணமாக, +91XXXXXXXXXX)", key: 'phone', validate: (input) => /^\+91\d{10}$/.test(input.trim()), error: "+91XXXXXXXXXX வடிவமைப்பில் சரியான தொலைபேசி எண்ணை உள்ளிடவும்." }
        ]
    };

    let currentPrompts = [];

    function addMessage(text, sender = 'bot') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('p-4', 'rounded-xl', 'max-w-xs', 'md:max-w-md', sender === 'user' ? 'user-message' : 'bot-message', sender === 'user' ? 'self-end' : 'self-start');
        messageDiv.textContent = text;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function renderOptions(options) {
        optionArea.innerHTML = '';
        optionArea.classList.remove('hidden');
        inputArea.classList.add('hidden');
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.dataset.value = option;
            button.classList.add('option-button', 'p-3', 'bg-gray-100', 'rounded-full', 'border', 'border-gray-300', 'text-gray-700', 'font-medium', 'text-sm');
            button.addEventListener('click', () => {
                handleResponse(option);
            });
            optionArea.appendChild(button);
        });
    }

    function showTextInput() {
        inputArea.classList.remove('hidden');
        optionArea.classList.add('hidden');
        chatInput.focus();
    }

    function handleNextStep() {
        if (currentStep < currentPrompts.length) {
            const prompt = currentPrompts[currentStep];
            addMessage(prompt.message);
            if (prompt.type === 'options') {
                renderOptions(prompt.options);
            } else {
                showTextInput();
            }
        } else {
            addMessage("🎉 All done! Your profile is complete. Redirecting you to the dashboard...");
            
            // --- Crucial addition: Save name to localStorage before redirecting ---
            localStorage.setItem('workerName', registrationData.name);

            console.log("Final Registration Data:", registrationData);
            // Simulate redirection
            setTimeout(() => {
                window.location.href = 'worker-dashboard.html';
            }, 2000);
        }
    }

    function handleResponse(response) {
        const prompt = currentPrompts[currentStep];
        addMessage(response, 'user');

        if (prompt.validate(response)) {
            registrationData[prompt.key] = response;
            currentStep++;
            setTimeout(handleNextStep, 800);
        } else {
            addMessage(prompt.error || "That's not a valid input. Please try again.");
            if (prompt.type === 'options') {
                renderOptions(prompt.options);
            } else {
                showTextInput();
            }
        }
    }

    // Event Listener for language selection
    languageCards.forEach(card => {
        card.addEventListener('click', () => {
            const lang = card.dataset.lang;
            if (allPrompts[lang]) {
                currentPrompts = allPrompts[lang];
                languageSelectScreen.classList.add('hidden');
                chatInterfaceContainer.classList.remove('hidden');

                setTimeout(() => {
                    chatInterfaceContainer.style.opacity = '1';
                    handleNextStep();
                }, 100);
            } else {
                addMessage("Sorry, this language is not yet supported. Please select another.");
            }
        });
    });

    // Event Listener for the form submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleResponse(chatInput.value);
        chatInput.value = '';
    });
});