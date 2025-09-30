// Fast Reader Class - Reusable component for displaying text quickly
class FastReader {
    constructor(options = {}) {
        this.wordDisplayElement = options.wordDisplayElement || document.getElementById('chatWordDisplay');
        this.progressElement = options.progressElement || document.getElementById('chatProgressFill');
        this.currentWordElement = options.currentWordElement || document.getElementById('chatCurrentWord');
        this.totalWordsElement = options.totalWordsElement || document.getElementById('chatTotalWords');
        this.speedSlider = options.speedSlider || document.getElementById('chatSpeedSlider');
        this.speedDisplay = options.speedDisplay || document.getElementById('chatSpeedDisplay');
        
        this.words = [];
        this.currentWordIndex = 0;
        this.isPlaying = false;
        this.intervalId = null;
        this.wordsPerMinute = parseInt(this.speedSlider?.value) || 400;
        this.onComplete = options.onComplete || null;
        this.onPause = options.onPause || null;
        
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.speedSlider) {
            this.speedSlider.addEventListener('input', () => {
                this.wordsPerMinute = parseInt(this.speedSlider.value);
                if (this.speedDisplay) {
                    this.speedDisplay.textContent = this.wordsPerMinute;
                }
                
                // Restart with new speed if currently playing
                if (this.isPlaying) {
                    this.pause();
                    this.play();
                }
            });
        }
    }
    
    setText(text) {
        // Clean and split text into words
        this.words = text
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(word => word.length > 0);
        
        this.currentWordIndex = 0;
        this.updateDisplay();
        this.updateProgress();
        this.updateWordCounter();
    }
    
    play() {
        if (this.words.length === 0) return;
        
        this.isPlaying = true;
        const intervalTime = 60000 / this.wordsPerMinute; // Convert WPM to milliseconds
        
        this.intervalId = setInterval(() => {
            if (this.currentWordIndex >= this.words.length) {
                this.complete();
                return;
            }
            
            this.displayCurrentWord();
            this.currentWordIndex++;
            this.updateProgress();
            this.updateWordCounter();
        }, intervalTime);
    }
    
    pause() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        if (this.onPause) {
            this.onPause();
        }
    }
    
    resume() {
        if (!this.isPlaying && this.currentWordIndex < this.words.length) {
            this.play();
        }
    }
    
    reset() {
        this.pause();
        this.currentWordIndex = 0;
        this.updateDisplay();
        this.updateProgress();
        this.updateWordCounter();
    }
    
    complete() {
        this.pause();
        if (this.wordDisplayElement) {
            this.wordDisplayElement.textContent = '✅ Reading Complete!';
        }
        
        if (this.onComplete) {
            this.onComplete();
        }
    }
    
    displayCurrentWord() {
        if (this.currentWordIndex < this.words.length && this.wordDisplayElement) {
            const word = this.words[this.currentWordIndex];
            this.wordDisplayElement.textContent = word;
            
            // Add visual effect for emphasis
            this.wordDisplayElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                if (this.wordDisplayElement) {
                    this.wordDisplayElement.style.transform = 'scale(1)';
                }
            }, 100);
        }
    }
    
    updateDisplay() {
        if (this.currentWordIndex < this.words.length && this.wordDisplayElement) {
            this.wordDisplayElement.textContent = this.words[this.currentWordIndex];
        } else if (this.wordDisplayElement) {
            this.wordDisplayElement.textContent = 'Ready to read...';
        }
    }
    
    updateProgress() {
        if (this.progressElement && this.words.length > 0) {
            const progress = (this.currentWordIndex / this.words.length) * 100;
            this.progressElement.style.width = `${progress}%`;
        }
    }
    
    updateWordCounter() {
        if (this.currentWordElement) {
            this.currentWordElement.textContent = Math.min(this.currentWordIndex + 1, this.words.length);
        }
        if (this.totalWordsElement) {
            this.totalWordsElement.textContent = this.words.length;
        }
    }
    
    // Jump to specific word
    jumpToWord(index) {
        if (index >= 0 && index < this.words.length) {
            const wasPlaying = this.isPlaying;
            this.pause();
            this.currentWordIndex = index;
            this.updateDisplay();
            this.updateProgress();
            this.updateWordCounter();
            
            if (wasPlaying) {
                this.play();
            }
        }
    }
    
    // Skip forward/backward by number of words
    skipWords(count) {
        const newIndex = Math.max(0, Math.min(this.words.length - 1, this.currentWordIndex + count));
        this.jumpToWord(newIndex);
    }
    
    // Get current reading state
    getState() {
        return {
            isPlaying: this.isPlaying,
            currentWordIndex: this.currentWordIndex,
            totalWords: this.words.length,
            progress: this.words.length > 0 ? (this.currentWordIndex / this.words.length) * 100 : 0,
            speed: this.wordsPerMinute
        };
    }
    
    // Set speed programmatically
    setSpeed(wpm) {
        this.wordsPerMinute = Math.max(100, Math.min(1000, wpm));
        if (this.speedSlider) {
            this.speedSlider.value = this.wordsPerMinute;
        }
        if (this.speedDisplay) {
            this.speedDisplay.textContent = this.wordsPerMinute;
        }
        
        // Restart with new speed if currently playing
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }
    
    // Destroy the reader instance
    destroy() {
        this.pause();
        if (this.speedSlider) {
            this.speedSlider.removeEventListener('input', this.bindEvents);
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastReader;
}