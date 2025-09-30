// AI Chat Application with Fast Reading Integration
class AIChatApp {
    constructor() {
        this.currentChatId = null;
        this.fastReader = null;
        this.fastReadMode = false;
        this.isConnected = false;
        this.chatHistory = [];
        this.settings = {
            n8nWebhookUrl: '',
            defaultSpeed: 400,
            autoFastRead: false,
            saveChatHistory: true
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSettings();
        this.initializeFastReader();
        this.loadChatHistory();
        this.setupFirebase();
    }
    
    bindEvents() {
        // Message input events
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        
        if (messageInput) {
            messageInput.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.sendMessage();
                }
            });
            
            messageInput.addEventListener('input', () => {
                const hasText = messageInput.value.trim().length > 0;
                if (sendBtn) {
                    sendBtn.disabled = !hasText;
                }
            });
        }
        
        // Model selection
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.addEventListener('change', () => {
                console.log('Model changed to:', modelSelect.value);
            });
        }
        
        // Speed slider in fast reading mode
        const speedSlider = document.getElementById('chatSpeedSlider');
        const speedDisplay = document.getElementById('chatSpeedDisplay');
        
        if (speedSlider && speedDisplay) {
            speedSlider.addEventListener('input', () => {
                speedDisplay.textContent = speedSlider.value;
            });
        }
    }
    
    initializeFastReader() {
        this.fastReader = new FastReader({
            wordDisplayElement: document.getElementById('chatWordDisplay'),
            progressElement: document.getElementById('chatProgressFill'),
            currentWordElement: document.getElementById('chatCurrentWord'),
            totalWordsElement: document.getElementById('chatTotalWords'),
            speedSlider: document.getElementById('chatSpeedSlider'),
            speedDisplay: document.getElementById('chatSpeedDisplay'),
            onComplete: () => {
                console.log('Fast reading completed');
                setTimeout(() => {
                    this.closeFastReading();
                }, 2000);
            },
            onPause: () => {
                console.log('Fast reading paused');
            }
        });
    }
    
    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const modelSelect = document.getElementById('modelSelect');
        
        if (!messageInput || !sendBtn) return;
        
        const message = messageInput.value.trim();
        if (!message) return;
        
        const selectedModel = modelSelect ? modelSelect.value : 'gpt-3.5-turbo';
        
        // Disable send button and show loading
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loading"></span> Sending...';
        
        // Add user message to chat
        this.addMessageToChat(message, 'user');
        
        // Clear input
        messageInput.value = '';
        
        try {
            // Send message to N8n webhook or direct API
            const response = await this.sendToAI(message, selectedModel);
            
            // Add AI response to chat
            this.addMessageToChat(response, 'ai');
            
            // Auto-activate fast reading if enabled
            if (this.settings.autoFastRead || this.fastReadMode) {
                this.startFastReading(response);
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessageToChat('Sorry, there was an error processing your message. Please try again.', 'ai', true);
        } finally {
            // Re-enable send button
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<span id="sendIcon">📤</span> Send';
        }
    }
    
    async sendToAI(message, model) {
        // Check if N8n webhook is configured
        if (this.settings.n8nWebhookUrl) {
            return await this.sendToN8n(message, model);
        } else {
            // Fallback: simulate AI response for demo purposes
            return await this.simulateAIResponse(message, model);
        }
    }
    
    async sendToN8n(message, model) {
        const response = await fetch(this.settings.n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                model: model,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response || data.message || 'No response received from AI.';
    }
    
    async simulateAIResponse(message, model) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Generate a realistic AI response
        const responses = [
            `That's an interesting question about "${message}". Based on the ${model} model, I can help you understand this topic better. Here's what I think: ${message.toLowerCase().includes('explain') ? 'This concept involves several key components that work together to create a comprehensive understanding.' : 'There are multiple perspectives to consider when approaching this subject.'} Would you like me to elaborate on any specific aspect?`,
            `I understand you're asking about "${message}". Using ${model}, I can provide you with detailed insights. The key factors to consider include various technical and practical elements that influence the outcome. This is a complex topic that requires careful analysis of multiple variables and their interactions.`,
            `Thank you for your question regarding "${message}". According to ${model}'s training, this involves several interconnected concepts that are fundamental to understanding the broader context. Let me break this down into manageable components that will help clarify the main principles and their applications.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    addMessageToChat(message, type, isError = false) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;
        
        // Remove welcome message if it exists
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        if (isError) {
            messageContent.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
        }
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        
        // Add action buttons for AI messages
        if (type === 'ai' && !isError) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            
            const fastReadBtn = document.createElement('button');
            fastReadBtn.className = 'action-btn';
            fastReadBtn.textContent = '⚡ Fast Read';
            fastReadBtn.onclick = () => this.startFastReading(message);
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'action-btn';
            copyBtn.textContent = '📋 Copy';
            copyBtn.onclick = () => this.copyToClipboard(message);
            
            actionsDiv.appendChild(fastReadBtn);
            actionsDiv.appendChild(copyBtn);
            messageDiv.appendChild(actionsDiv);
        }
        
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save to chat history
        if (this.settings.saveChatHistory) {
            this.saveChatMessage(message, type);
        }
    }
    
    startFastReading(text) {
        const fastReadingContainer = document.getElementById('fastReadingContainer');
        if (!fastReadingContainer || !this.fastReader) return;
        
        // Show fast reading interface
        fastReadingContainer.style.display = 'flex';
        
        // Set text and start reading
        this.fastReader.setText(text);
        this.fastReader.setSpeed(this.settings.defaultSpeed);
        this.fastReader.play();
    }
    
    pauseFastReading() {
        if (this.fastReader) {
            if (this.fastReader.getState().isPlaying) {
                this.fastReader.pause();
                document.getElementById('pauseReadingBtn').innerHTML = '▶️ Resume';
            } else {
                this.fastReader.resume();
                document.getElementById('pauseReadingBtn').innerHTML = '⏸️ Pause';
            }
        }
    }
    
    closeFastReading() {
        const fastReadingContainer = document.getElementById('fastReadingContainer');
        if (fastReadingContainer) {
            fastReadingContainer.style.display = 'none';
        }
        
        if (this.fastReader) {
            this.fastReader.reset();
        }
        
        // Reset pause button
        const pauseBtn = document.getElementById('pauseReadingBtn');
        if (pauseBtn) {
            pauseBtn.innerHTML = '⏸️ Pause';
        }
    }
    
    toggleFastReadMode() {
        this.fastReadMode = !this.fastReadMode;
        const toggleBtn = document.querySelector('.fast-read-toggle');
        
        if (toggleBtn) {
            if (this.fastReadMode) {
                toggleBtn.classList.add('active');
                toggleBtn.textContent = '⚡ Fast Read ON';
            } else {
                toggleBtn.classList.remove('active');
                toggleBtn.textContent = '⚡ Fast Read Mode';
            }
        }
    }
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
            // Show temporary success message
            const notification = document.createElement('div');
            notification.textContent = 'Copied to clipboard!';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(16, 185, 129, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 10px;
                z-index: 3000;
                backdrop-filter: blur(10px);
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
    
    startNewChat() {
        const messagesContainer = document.getElementById('messagesContainer');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <h2>Welcome to AI Chat Hub 🤖</h2>
                    <p>Start a conversation with AI and experience responses through our fast reading technology!</p>
                    <div class="model-selection">
                        <label for="modelSelect">Choose AI Model:</label>
                        <select id="modelSelect" class="model-select">
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            <option value="gpt-4">GPT-4</option>
                            <option value="claude-3">Claude 3</option>
                            <option value="gemini-pro">Gemini Pro</option>
                        </select>
                    </div>
                </div>
            `;
        }
        
        this.closeFastReading();
        this.currentChatId = null;
    }
    
    saveChatMessage(message, type) {
        // Implementation for Firebase or local storage
        console.log('Saving message:', { message, type, timestamp: new Date().toISOString() });
    }
    
    loadChatHistory() {
        // Implementation for loading chat history from Firebase
        console.log('Loading chat history...');
    }
    
    setupFirebase() {
        // Firebase configuration will be loaded from firebase-config.js
        console.log('Setting up Firebase connection...');
    }
    
    openSettings() {
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.style.display = 'flex';
            
            // Load current settings
            document.getElementById('n8nWebhookUrl').value = this.settings.n8nWebhookUrl;
            document.getElementById('defaultSpeed').value = this.settings.defaultSpeed;
            document.getElementById('autoFastRead').checked = this.settings.autoFastRead;
            document.getElementById('saveChatHistory').checked = this.settings.saveChatHistory;
        }
    }
    
    closeSettings() {
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.style.display = 'none';
        }
    }
    
    saveSettings() {
        this.settings.n8nWebhookUrl = document.getElementById('n8nWebhookUrl').value;
        this.settings.defaultSpeed = parseInt(document.getElementById('defaultSpeed').value);
        this.settings.autoFastRead = document.getElementById('autoFastRead').checked;
        this.settings.saveChatHistory = document.getElementById('saveChatHistory').checked;
        
        // Save to localStorage
        localStorage.setItem('chatAppSettings', JSON.stringify(this.settings));
        
        this.closeSettings();
        
        console.log('Settings saved:', this.settings);
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('chatAppSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }
    
    toggleSidebar() {
        const sidebar = document.querySelector('.chat-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    }
}

// Navigation functions
function goHome() {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.5';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 200);
}

function goToSpeedReading() {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.5';
    
    setTimeout(() => {
        window.location.href = 'speed-reader.html';
    }, 200);
}

// Global function handlers (called from HTML)
let chatApp;

function sendMessage() {
    if (chatApp) chatApp.sendMessage();
}

function pauseFastReading() {
    if (chatApp) chatApp.pauseFastReading();
}

function closeFastReading() {
    if (chatApp) chatApp.closeFastReading();
}

function toggleFastReadMode() {
    if (chatApp) chatApp.toggleFastReadMode();
}

function startNewChat() {
    if (chatApp) chatApp.startNewChat();
}

function openSettings() {
    if (chatApp) chatApp.openSettings();
}

function closeSettings() {
    if (chatApp) chatApp.closeSettings();
}

function saveSettings() {
    if (chatApp) chatApp.saveSettings();
}

function toggleSidebar() {
    if (chatApp) chatApp.toggleSidebar();
}

// Initialize the chat application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    chatApp = new AIChatApp();
});