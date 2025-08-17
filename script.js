class SpeedReader {
    constructor() {
        this.words = [];
        this.currentWordIndex = 0;
        this.isPlaying = false;
        this.intervalId = null;
        this.wordsPerMinute = 500;
        
        // Wait for i18n to be ready
        if (typeof i18n !== 'undefined') {
            this.initializeElements();
            this.bindEvents();
            this.updateSpeedDisplay();
            this.updateUITexts();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    this.initializeElements();
                    this.bindEvents();
                    this.updateSpeedDisplay();
                    this.updateUITexts();
                }, 100);
            });
        }
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
        
        // Book search elements
        this.bookSearchInput = document.getElementById('bookSearchInput');
        this.searchBooksBtn = document.getElementById('searchBooksBtn');
        this.searchResults = document.getElementById('searchResults');
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }
    
    bindEvents() {
        this.playBtn.addEventListener('click', () => this.toggleReading());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.sampleBtn.addEventListener('click', () => this.loadSampleText());
        this.speedSlider.addEventListener('input', () => this.updateSpeed());
        this.textInput.addEventListener('input', () => this.prepareText());
        
        // Book search events
        this.searchBooksBtn.addEventListener('click', () => this.searchBooks());
        this.bookSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBooks();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isInputFocused()) {
                e.preventDefault();
                this.toggleReading();
            } else if (e.code === 'Escape') {
                this.reset();
            }
        });
        
        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.updateUITexts();
        });
    }
    
    updateUITexts() {
        if (typeof i18n === 'undefined') return;
        
        // Update dynamic text that's not handled by data-i18n attributes
        if (this.words.length === 0) {
            this.wordDisplay.textContent = i18n.translate('enter-text');
        } else if (!this.isPlaying && this.currentWordIndex === 0) {
            this.wordDisplay.textContent = i18n.translate('ready-start');
        }
        
        // Update button text based on current state
        this.updatePlayButtonText();
    }
    
    updatePlayButtonText() {
        if (typeof i18n === 'undefined') return;
        
        const playTextElement = this.playBtn.querySelector('[data-i18n="start-reading"]');
        if (!playTextElement) return;
        
        if (this.isPlaying) {
            playTextElement.textContent = i18n.translate('pause');
            this.playIcon.textContent = '⏸️';
        } else if (this.currentWordIndex >= this.words.length && this.words.length > 0) {
            playTextElement.textContent = i18n.translate('start-over');
            this.playIcon.textContent = '🔄';
        } else if (this.currentWordIndex > 0) {
            playTextElement.textContent = i18n.translate('resume');
            this.playIcon.textContent = '▶️';
        } else {
            playTextElement.textContent = i18n.translate('start-reading');
            this.playIcon.textContent = '▶️';
        }
    }
    
    isInputFocused() {
        return document.activeElement === this.textInput || document.activeElement === this.bookSearchInput;
    }
    
    // Internet Archive Integration
    async searchBooks() {
        const query = this.bookSearchInput.value.trim();
        if (!query) {
            alert(i18n ? i18n.translate('enter-search') : 'Please enter a search term');
            return;
        }
        
        this.searchBooksBtn.disabled = true;
        this.loadingIndicator.style.display = 'block';
        this.searchResults.innerHTML = '';
        
        try {
            // Search Internet Archive for books
            const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}%20AND%20mediatype:texts%20AND%20format:("Text%20PDF"%20OR%20"DjVuTXT"%20OR%20"Abbyy%20GZ")&fl=identifier,title,creator,description,date,downloads,format&sort[]=downloads%20desc&rows=10&page=1&output=json`;
            
            const response = await fetch(searchUrl);
            const data = await response.json();
            
            if (data.response && data.response.docs && data.response.docs.length > 0) {
                this.displaySearchResults(data.response.docs);
            } else {
                this.searchResults.innerHTML = `<p style="text-align: center; padding: 20px; color: #666;">${i18n ? i18n.translate('no-books') : 'No books found. Try a different search term.'}</p>`;
            }
        } catch (error) {
            console.error('Search error:', error);
            this.searchResults.innerHTML = `<p style="text-align: center; padding: 20px; color: #dc3545;">${i18n ? i18n.translate('search-error') : 'Error searching books. Please try again.'}</p>`;
        } finally {
            this.searchBooksBtn.disabled = false;
            this.loadingIndicator.style.display = 'none';
        }
    }
    
    displaySearchResults(books) {
        this.searchResults.innerHTML = '';
        
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-item';
            
            const title = book.title || 'Untitled';
            const author = book.creator ? (Array.isArray(book.creator) ? book.creator.join(', ') : book.creator) : 'Unknown Author';
            const description = book.description ? 
                (Array.isArray(book.description) ? book.description[0] : book.description).substring(0, 200) + '...' : 
                'No description available';
            const date = book.date || 'Unknown date';
            const downloads = book.downloads || '0';
            
            bookElement.innerHTML = `
                <div class="book-title">${this.escapeHtml(title)}</div>
                <div class="book-author">by ${this.escapeHtml(author)}</div>
                <div class="book-description">${this.escapeHtml(description)}</div>
                <div class="book-meta">
                    <span>📅 ${this.escapeHtml(date)}</span>
                    <span>📥 ${this.escapeHtml(downloads)} downloads</span>
                </div>
                <div class="book-loading" style="display: none;">
                    <div class="spinner"></div>
                </div>
            `;
            
            bookElement.addEventListener('click', () => this.loadBookText(book.identifier, bookElement));
            this.searchResults.appendChild(bookElement);
        });
    }
    
    async loadBookText(identifier, bookElement) {
        bookElement.classList.add('loading');
        const loadingElement = bookElement.querySelector('.book-loading');
        loadingElement.style.display = 'block';
        
        try {
            // First, get metadata to understand available formats
            const metadataUrl = `https://archive.org/metadata/${identifier}`;
            const metadataResponse = await fetch(metadataUrl);
            
            if (!metadataResponse.ok) {
                throw new Error('Failed to fetch book metadata');
            }
            
            const metadata = await metadataResponse.json();
            
            // Look for text files in order of preference
            const textFormats = [
                'DjVuTXT',
                'Text',
                'Abbyy GZ',
                'Single Page Processed JP2 ZIP',
                'Scandata',
                'Djvu XML'
            ];
            
            let textFile = null;
            let bestFormat = null;
            
            // Find the best available text format
            for (const format of textFormats) {
                textFile = metadata.files?.find(file => 
                    file.format === format || 
                    (file.name && (
                        file.name.endsWith('.txt') || 
                        file.name.endsWith('_djvu.txt') ||
                        file.name.endsWith('_abbyy.gz')
                    ))
                );
                if (textFile) {
                    bestFormat = format;
                    break;
                }
            }
            
            // If no text file found, try common naming patterns
            if (!textFile) {
                const possibleTextFiles = metadata.files?.filter(file => 
                    file.name.includes('.txt') ||
                    file.name.includes('djvu') ||
                    file.name.includes('abbyy')
                ) || [];
                
                if (possibleTextFiles.length > 0) {
                    // Sort by file size (larger usually means full text)
                    textFile = possibleTextFiles.sort((a, b) => 
                        (parseInt(b.size) || 0) - (parseInt(a.size) || 0)
                    )[0];
                    bestFormat = 'Found text file';
                }
            }
            
            if (!textFile) {
                throw new Error(i18n ? i18n.translate('no-text-version') : 'No text version available for this book');
            }
            
            // Try multiple URL patterns for different hosting setups
            const urlPatterns = [
                `https://archive.org/download/${identifier}/${textFile.name}`,
                `https://ia902609.us.archive.org/download/${identifier}/${textFile.name}`,
                `https://ia802609.us.archive.org/download/${identifier}/${textFile.name}`,
                `https://archive.org/stream/${identifier}/${textFile.name.replace(/\.[^/.]+$/, '')}_djvu.txt`
            ];
            
            let text = null;
            let successUrl = null;
            
            // Try each URL pattern
            for (const url of urlPatterns) {
                try {
                    console.log(`Trying to fetch from: ${url}`);
                    const response = await fetch(url, {
                        mode: 'cors',
                        headers: {
                            'Accept': 'text/plain, text/html, application/octet-stream, */*'
                        }
                    });
                    
                    if (response.ok) {
                        const contentType = response.headers.get('content-type') || '';
                        
                        if (textFile.name.endsWith('.gz') || textFile.format === 'Abbyy GZ') {
                            // Handle gzipped content
                            const arrayBuffer = await response.arrayBuffer();
                            text = await this.decompressGzip(arrayBuffer);
                        } else {
                            text = await response.text();
                        }
                        
                        successUrl = url;
                        break;
                    }
                } catch (fetchError) {
                    console.log(`Failed to fetch from ${url}:`, fetchError.message);
                    continue;
                }
            }
            
            // If direct download failed, try the Internet Archive's streaming service
            if (!text) {
                try {
                    const streamUrl = `https://archive.org/stream/${identifier}/${identifier}_djvu.txt`;
                    console.log(`Trying stream URL: ${streamUrl}`);
                    const response = await fetch(streamUrl);
                    if (response.ok) {
                        text = await response.text();
                        successUrl = streamUrl;
                    }
                } catch (streamError) {
                    console.log('Stream URL also failed:', streamError.message);
                }
            }
            
            // If still no text, provide user with manual download option
            if (!text) {
                const downloadUrl = `https://archive.org/download/${identifier}/${textFile.name}`;
                const manualMessage = `
                    <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 10px 0;">
                        <h4>Manual Download Required</h4>
                        <p>Due to browser security restrictions, automatic loading failed.</p>
                        <p><strong>Please follow these steps:</strong></p>
                        <ol style="text-align: left; display: inline-block;">
                            <li>Click <a href="${downloadUrl}" target="_blank" style="color: #667eea; font-weight: bold;">this link</a> to download the text file</li>
                            <li>Open the downloaded file in a text editor</li>
                            <li>Copy the text content</li>
                            <li>Paste it into the text area above</li>
                        </ol>
                        <a href="${downloadUrl}" target="_blank" class="sample-btn" style="display: inline-block; margin-top: 10px; text-decoration: none;">
                            📥 Download Text File
                        </a>
                    </div>
                `;
                
                // Show manual download instructions
                const resultsContainer = document.querySelector('.search-results');
                const manualDiv = document.createElement('div');
                manualDiv.innerHTML = manualMessage;
                resultsContainer.insertBefore(manualDiv, resultsContainer.firstChild);
                
                // Scroll to show the instructions
                manualDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                return; // Exit without throwing error
            }
            
            if (text && text.trim().length > 100) {
                // Clean up the text
                const cleanedText = this.cleanBookText(text);
                
                if (cleanedText.trim().length > 100) {
                    this.textInput.value = cleanedText;
                    this.prepareText();
                    
                    // Scroll to the top and show success message
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Show success feedback
                    const originalTitle = bookElement.querySelector('.book-title').textContent;
                    bookElement.querySelector('.book-title').innerHTML = `✅ ${originalTitle} - ${i18n ? i18n.translate('loaded-success') : 'Loaded!'} (${bestFormat})`;
                    
                    setTimeout(() => {
                        bookElement.querySelector('.book-title').textContent = originalTitle;
                    }, 3000);
                    
                    console.log(`Successfully loaded text from: ${successUrl}`);
                } else {
                    throw new Error(i18n ? i18n.translate('text-too-short') : 'Text content is too short or corrupted');
                }
            } else {
                throw new Error(i18n ? i18n.translate('text-too-short') : 'Text content is too short or corrupted');
            }
            
        } catch (error) {
            console.error('Error loading book:', error);
            const errorMessage = i18n ? i18n.translate('load-error') : 'Could not load this book';
            
            // More specific error messages
            let specificError = error.message;
            if (error.message.includes('Failed to fetch')) {
                specificError = 'Network error - try again or use manual download option above';
            } else if (error.message.includes('CORS')) {
                specificError = 'Browser security restriction - use manual download option';
            }
            
            alert(`${errorMessage}: ${specificError}`);
        } finally {
            bookElement.classList.remove('loading');
            loadingElement.style.display = 'none';
        }
    }
    
    // Helper function to decompress gzip files
    async decompressGzip(arrayBuffer) {
        try {
            // Use browser's built-in decompression if available
            const ds = new DecompressionStream('gzip');
            const decompressedStream = new Response(arrayBuffer).body.pipeThrough(ds);
            const decompressed = await new Response(decompressedStream).arrayBuffer();
            return new TextDecoder().decode(decompressed);
        } catch (gzipError) {
            console.log('Native gzip decompression failed, trying alternative method');
            // Fallback: try to read as text directly (some files might not actually be gzipped)
            return new TextDecoder().decode(arrayBuffer);
        }
    }
    
    cleanBookText(text) {
        let cleaned = text;
        
        // Remove common OCR and scanning artifacts
        cleaned = cleaned
            // Remove excessive whitespace and normalize line breaks
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            // Remove multiple consecutive spaces
            .replace(/ +/g, ' ')
            // Remove multiple consecutive line breaks (keep max 2)
            .replace(/\n\s*\n\s*\n+/g, '\n\n')
            // Remove common OCR artifacts and page markers
            .replace(/\n\s*\d+\s*\n/g, '\n') // Remove isolated page numbers
            .replace(/\n\s*Page \d+.*?\n/gi, '\n')
            .replace(/\n\s*Chapter \d+\s*\n/gi, '\n\nChapter ')
            // Remove headers and footers patterns
            .replace(/\n\s*THE\s+PROJECT\s+GUTENBERG.*?\n/gi, '\n')
            .replace(/\n\s*Project\s+Gutenberg.*?\n/gi, '\n')
            .replace(/\n\s*End\s+of\s+Project\s+Gutenberg.*$/gi, '')
            .replace(/\n\s*\*\*\*.*?\*\*\*\s*\n/g, '\n')
            // Remove excessive spaces at line beginnings
            .replace(/\n +/g, '\n')
            // Remove common scanning artifacts
            .replace(/[""]/g, '"') // Normalize quotes
            .replace(/['']/g, "'") // Normalize apostrophes
            .replace(/…/g, '...') // Normalize ellipsis
            .replace(/—/g, '--') // Normalize em dashes
            .replace(/–/g, '-') // Normalize en dashes
            // Remove form feed and other control characters
            .replace(/\f/g, '\n')
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            // Clean up hyphenated words at line breaks
            .replace(/-\n([a-z])/g, '$1')
            // Fix common OCR errors
            .replace(/\bn\b/g, 'in') // Common OCR error
            .replace(/\brn\b/g, 'in') // Common OCR error
            .replace(/\bTHE\b/g, 'THE') // Fix case
            // Remove isolated single characters on their own lines
            .replace(/\n\s*[a-zA-Z]\s*\n/g, '\n')
            // Clean up chapter and section headers
            .replace(/\n\s*(CHAPTER|Chapter|chapter)\s+([IVXLCDM]+|\d+)\s*\n/g, '\n\nChapter $2\n\n')
            // Trim the whole text
            .trim();
            
        // Additional cleaning for specific formats
        if (cleaned.includes('START OF THE PROJECT GUTENBERG')) {
            // Extract main content from Project Gutenberg files
            const startMarker = /START OF TH[EI]S? PROJECT GUTENBERG.*?\n/i;
            const endMarker = /END OF TH[EI]S? PROJECT GUTENBERG.*$/i;
            
            const startMatch = cleaned.match(startMarker);
            const endMatch = cleaned.match(endMarker);
            
            if (startMatch) {
                cleaned = cleaned.substring(startMatch.index + startMatch[0].length);
            }
            if (endMatch) {
                cleaned = cleaned.substring(0, endMatch.index);
            }
        }
        
        // Remove table of contents patterns
        cleaned = cleaned.replace(/\n\s*CONTENTS\s*\n[\s\S]*?\n\s*CHAPTER\s+1/i, '\n\nCHAPTER 1');
        
        // Final cleanup
        cleaned = cleaned
            .replace(/\n\s*\n\s*\n+/g, '\n\n') // Remove excessive line breaks again
            .replace(/^\s+|\s+$/g, '') // Trim start and end
            .replace(/\n\s+/g, '\n'); // Remove leading spaces on lines
            
        return cleaned;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
                this.wordDisplay.textContent = i18n ? i18n.translate('ready-start') : 'Ready to start';
            } else {
                this.playBtn.disabled = true;
                this.wordDisplay.textContent = i18n ? i18n.translate('enter-text') : 'Enter some text to begin';
            }
        } else {
            this.words = [];
            this.playBtn.disabled = true;
            this.wordDisplay.textContent = i18n ? i18n.translate('enter-text') : 'Enter some text to begin';
            this.updateWordCount();
            this.updateProgress();
        }
        this.updatePlayButtonText();
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
            alert(i18n ? i18n.translate('enter-text') : 'Please enter some text first!');
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
        this.updatePlayButtonText();
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
        this.updatePlayButtonText();
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
            this.updatePlayButtonText();
            this.playBtn.classList.remove('playing');
            this.wordDisplay.textContent = i18n ? i18n.translate('finished') : '✅ Finished!';
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
        this.updatePlayButtonText();
        this.playBtn.classList.remove('playing');
        
        if (this.words.length > 0) {
            this.wordDisplay.textContent = i18n ? i18n.translate('ready-start') : 'Ready to start';
            this.playBtn.disabled = false;
        } else {
            this.wordDisplay.textContent = i18n ? i18n.translate('enter-text') : 'Enter some text to begin';
            this.playBtn.disabled = true;
        }
        
        this.updateWordCount();
        this.updateProgress();
    }
    
    loadSampleText() {
        // Use localized sample text if i18n is available
        const sampleText = i18n ? i18n.getSampleText() : `Speed reading is a collection of reading methods which attempt to increase rates of reading without greatly reducing comprehension or retention. Methods include chunking and eliminating subvocalization. The many available speed-reading training programs include books, videos, software, and seminars.

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
    
    // Initialize Google AdSense ads
    initializeAds();
});

// Google AdSense initialization
function initializeAds() {
    // Check if AdSense script is loaded
    if (typeof window.adsbygoogle !== 'undefined') {
        try {
            // Push all ad units to AdSense
            const adElements = document.querySelectorAll('.adsbygoogle');
            adElements.forEach(ad => {
                if (!ad.getAttribute('data-adsbygoogle-status')) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            });
            
            console.log('AdSense ads initialized');
        } catch (error) {
            console.log('AdSense initialization error:', error);
        }
    } else {
        // Retry after a short delay if AdSense script isn't loaded yet
        setTimeout(initializeAds, 1000);
    }
}

// Function to refresh ads (useful for single-page applications)
function refreshAds() {
    if (typeof window.adsbygoogle !== 'undefined') {
        try {
            const adElements = document.querySelectorAll('.adsbygoogle');
            adElements.forEach(ad => {
                // Remove the status attribute to allow re-initialization
                ad.removeAttribute('data-adsbygoogle-status');
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            });
        } catch (error) {
            console.log('Ad refresh error:', error);
        }
    }
}

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
