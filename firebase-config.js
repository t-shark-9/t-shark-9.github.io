// Firebase Configuration
// Replace with your actual Firebase config

const firebaseConfig = {
    // You'll need to replace these with your actual Firebase project credentials
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789"
};

// Initialize Firebase
let app, db, auth;

try {
    // Initialize Firebase App
    app = firebase.initializeApp(firebaseConfig);
    
    // Initialize Firestore
    db = firebase.firestore();
    
    // Initialize Auth
    auth = firebase.auth();
    
    console.log('Firebase initialized successfully');
    
    // Optional: Enable offline persistence
    db.enablePersistence()
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code == 'unimplemented') {
                console.log('The current browser does not support all of the features required to enable persistence');
            }
        });
    
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

// Firebase Chat Service
class FirebaseChatService {
    constructor() {
        this.db = db;
        this.auth = auth;
        this.currentUser = null;
        
        // Listen for auth state changes
        if (this.auth) {
            this.auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                if (user) {
                    console.log('User signed in:', user.uid);
                } else {
                    console.log('User signed out');
                }
            });
        }
    }
    
    // Sign in anonymously for demo purposes
    async signInAnonymously() {
        try {
            if (this.auth) {
                const result = await this.auth.signInAnonymously();
                console.log('Signed in anonymously:', result.user.uid);
                return result.user;
            }
        } catch (error) {
            console.error('Error signing in anonymously:', error);
            throw error;
        }
    }
    
    // Save a chat message
    async saveChatMessage(chatId, message, type, model = null) {
        try {
            if (!this.db || !this.currentUser) {
                console.log('Firebase not available or user not signed in, using local storage');
                return this.saveToLocalStorage(chatId, message, type, model);
            }
            
            const chatRef = this.db.collection('chats').doc(chatId);
            
            await chatRef.collection('messages').add({
                message: message,
                type: type,
                model: model,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userId: this.currentUser.uid
            });
            
            // Update chat metadata
            await chatRef.set({
                lastMessage: message,
                lastMessageType: type,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                userId: this.currentUser.uid,
                messageCount: firebase.firestore.FieldValue.increment(1)
            }, { merge: true });
            
            console.log('Message saved to Firebase');
            
        } catch (error) {
            console.error('Error saving message to Firebase:', error);
            // Fallback to local storage
            this.saveToLocalStorage(chatId, message, type, model);
        }
    }
    
    // Load chat history
    async loadChatHistory(chatId, limit = 50) {
        try {
            if (!this.db || !this.currentUser) {
                console.log('Firebase not available, loading from local storage');
                return this.loadFromLocalStorage(chatId);
            }
            
            const messagesRef = this.db.collection('chats').doc(chatId).collection('messages');
            const snapshot = await messagesRef
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            const messages = [];
            snapshot.forEach((doc) => {
                messages.unshift({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return messages;
            
        } catch (error) {
            console.error('Error loading chat history:', error);
            return this.loadFromLocalStorage(chatId);
        }
    }
    
    // Get list of user's chats
    async getUserChats() {
        try {
            if (!this.db || !this.currentUser) {
                return this.getLocalChats();
            }
            
            const chatsRef = this.db.collection('chats');
            const snapshot = await chatsRef
                .where('userId', '==', this.currentUser.uid)
                .orderBy('lastUpdated', 'desc')
                .get();
            
            const chats = [];
            snapshot.forEach((doc) => {
                chats.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return chats;
            
        } catch (error) {
            console.error('Error loading user chats:', error);
            return this.getLocalChats();
        }
    }
    
    // Local storage fallbacks
    saveToLocalStorage(chatId, message, type, model) {
        const chats = JSON.parse(localStorage.getItem('chatHistory') || '{}');
        
        if (!chats[chatId]) {
            chats[chatId] = {
                messages: [],
                lastUpdated: new Date().toISOString()
            };
        }
        
        chats[chatId].messages.push({
            message: message,
            type: type,
            model: model,
            timestamp: new Date().toISOString()
        });
        
        chats[chatId].lastMessage = message;
        chats[chatId].lastMessageType = type;
        chats[chatId].lastUpdated = new Date().toISOString();
        
        localStorage.setItem('chatHistory', JSON.stringify(chats));
    }
    
    loadFromLocalStorage(chatId) {
        const chats = JSON.parse(localStorage.getItem('chatHistory') || '{}');
        return chats[chatId]?.messages || [];
    }
    
    getLocalChats() {
        const chats = JSON.parse(localStorage.getItem('chatHistory') || '{}');
        return Object.entries(chats).map(([id, data]) => ({
            id,
            ...data
        }));
    }
    
    // Create new chat
    createNewChat() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize Firebase Chat Service
let firebaseChatService;

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        firebaseChatService = new FirebaseChatService();
        
        // Try to sign in anonymously
        if (firebaseChatService.auth) {
            firebaseChatService.signInAnonymously().catch(err => {
                console.log('Anonymous sign-in failed, continuing with local storage only');
            });
        }
    });
}