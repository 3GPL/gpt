const toggleSwitch = document.querySelector('input[type="checkbox"]');
const chatForm = document.getElementById('chat-form');
const messageContainer = document.getElementById('message-container');

toggleSwitch.addEventListener('change', function () {
    if (this.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    document.body.classList.add('dark-mode');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
}

// GPT interactions
chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const userInput = document.getElementById('user-input').value;
    appendMessage('user', userInput);
    getGPTResponse(userInput);
    document.getElementById('user-input').value = '';
});

function appendMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.innerHTML = `<p>${text}</p>`;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

async function getGPTResponse(input) {
    const response = await fetch('/your-gpt-api-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: input })
    });

    if (!response.ok) {
        appendMessage('bot', 'Oops! Something went wrong.');
        return;
    }

    const data = await response.json();
    appendMessage('bot', data.output);
}
