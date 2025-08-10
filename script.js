class SpeedReader {
    constructor() {
        this.words = [];
        this.currentWordIndex = 0;
        this.isPlaying = false;
        this.intervalId = null;
        this.wordsPerMinute = 500;
        
        this.initializeElements();
        this.bindEvents();
        this.updateSpeedDisplay();
    }
    
    initializeElements() {
        this.textInput = document.getElementById('textInput');
        this.playBtn = document.getElementById('playBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.wordDisplay = document.getElementById('wordDisplay');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedDisplay = document.getElementById('speedDisplay');
        this.currentWordSpan = document.getElementById('currentWord');
        this.totalWordsSpan = document.getElementById('totalWords');
        this.progressFill = document.getElementById('progressFill');
        this.playIcon = document.getElementById('playIcon');
    }
    
    bindEvents() {
        this.playBtn.addEventListener('click', () => this.toggleReading());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.sampleBtn.addEventListener('click', () => this.loadSampleText());
        this.speedSlider.addEventListener('input', () => this.updateSpeed());
        this.textInput.addEventListener('input', () => this.prepareText());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isInputFocused()) {
                e.preventDefault();
                this.toggleReading();
            } else if (e.code === 'Escape') {
                this.reset();
            }
        });
    }
    
    isInputFocused() {
        return document.activeElement === this.textInput;
    }
    
    prepareText() {
        const text = this.textInput.value.trim();
        if (text) {
            // Split text into words, removing extra whitespace
            this.words = text.split(/\s+/).filter(word => word.length > 0);
            this.currentWordIndex = 0;
            this.updateWordCount();
            this.updateProgress();
            
            if (this.words.length > 0) {
                this.playBtn.disabled = false;
                this.wordDisplay.textContent = 'Ready to start';
            } else {
                this.playBtn.disabled = true;
                this.wordDisplay.textContent = 'Enter some text to begin';
            }
        } else {
            this.words = [];
            this.playBtn.disabled = true;
            this.wordDisplay.textContent = 'Enter some text to begin';
            this.updateWordCount();
            this.updateProgress();
        }
    }
    
    updateSpeed() {
        this.wordsPerMinute = parseInt(this.speedSlider.value);
        this.updateSpeedDisplay();
        
        // If currently playing, restart with new speed
        if (this.isPlaying) {
            this.stopReading();
            this.startReading();
        }
    }
    
    updateSpeedDisplay() {
        this.speedDisplay.textContent = this.wordsPerMinute;
    }
    
    toggleReading() {
        if (this.words.length === 0) {
            alert('Please enter some text first!');
            return;
        }
        
        if (this.isPlaying) {
            this.pauseReading();
        } else {
            this.startReading();
        }
    }
    
    startReading() {
        if (this.currentWordIndex >= this.words.length) {
            this.currentWordIndex = 0;
        }
        
        this.isPlaying = true;
        this.playBtn.textContent = '⏸️ Pause';
        this.playBtn.classList.add('playing');
        
        // Calculate interval in milliseconds
        const intervalMs = (60 / this.wordsPerMinute) * 1000;
        
        this.displayCurrentWord();
        this.intervalId = setInterval(() => {
            this.nextWord();
        }, intervalMs);
    }
    
    pauseReading() {
        this.stopReading();
        this.playBtn.textContent = '▶️ Resume';
        this.playBtn.classList.remove('playing');
    }
    
    stopReading() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    nextWord() {
        this.currentWordIndex++;
        
        if (this.currentWordIndex >= this.words.length) {
            // Finished reading
            this.stopReading();
            this.playBtn.textContent = '🔄 Start Over';
            this.playBtn.classList.remove('playing');
            this.wordDisplay.textContent = '✅ Finished!';
            this.wordDisplay.classList.add('highlight');
            
            setTimeout(() => {
                this.wordDisplay.classList.remove('highlight');
            }, 1000);
            
            return;
        }
        
        this.displayCurrentWord();
    }
    
    displayCurrentWord() {
        if (this.currentWordIndex < this.words.length) {
            const word = this.words[this.currentWordIndex];
            this.wordDisplay.textContent = word;
            this.wordDisplay.classList.add('highlight');
            
            // Remove highlight after a short time
            setTimeout(() => {
                this.wordDisplay.classList.remove('highlight');
            }, 100);
            
            this.updateWordCount();
            this.updateProgress();
        }
    }
    
    updateWordCount() {
        this.currentWordSpan.textContent = this.currentWordIndex + 1;
        this.totalWordsSpan.textContent = this.words.length;
    }
    
    updateProgress() {
        if (this.words.length === 0) {
            this.progressFill.style.width = '0%';
            return;
        }
        
        const progressPercentage = ((this.currentWordIndex + 1) / this.words.length) * 100;
        this.progressFill.style.width = progressPercentage + '%';
    }
    
    reset() {
        this.stopReading();
        this.currentWordIndex = 0;
        this.playBtn.textContent = '▶️ Start Reading';
        this.playBtn.classList.remove('playing');
        
        if (this.words.length > 0) {
            this.wordDisplay.textContent = 'Ready to start';
            this.playBtn.disabled = false;
        } else {
            this.wordDisplay.textContent = 'Enter some text to begin';
            this.playBtn.disabled = true;
        }
        
        this.updateWordCount();
        this.updateProgress();
    }
    
    loadSampleText() {
        const sampleText = `Speed reading is a collection of reading methods which attempt to increase rates of reading without greatly reducing comprehension or retention. Methods include chunking and eliminating subvocalization. The many available speed-reading training programs include books, videos, software, and seminars.

There is little scientific evidence regarding speed reading, and as a result its value is contested. Cognitive neuroscientist Stanislas Dehaene says that claims of reading speeds of above 500 words per minute "must be viewed with skepticism" and that above 300 wpm people must start to use things like skimming or scanning which do not qualify as reading.

The average adult reads prose text at 250 to 300 words per minute. While proofreaders tasked with detecting errors read more slowly at 200 wpm. Higher reading speeds are claimed through speed reading programs, some of which are listed here.

This speed reading application helps you practice the technique of presenting one word at a time in a fixed position, allowing your eyes to stay focused while your brain processes each word individually. This method can help reduce subvocalization and improve reading efficiency for certain types of content.`;
        
        this.textInput.value = sampleText;
        this.prepareText();
        
        // Scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Initialize the speed reader when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpeedReader();
});

// Add some visual feedback for better user experience
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    const wordDisplay = document.getElementById('wordDisplay');
    
    // Create a subtle animation for word changes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes wordAppear {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        .word-display.animate {
            animation: wordAppear 0.1s ease-out;
        }
    `;
    document.head.appendChild(style);
});
