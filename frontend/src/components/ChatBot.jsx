import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Globe, Trash2 } from 'lucide-react';

function ChatBot() {
    // Initial welcome message fallback
    const welcomeMessage = {
        sender: 'bot',
        text: 'Namaste! I am your Smart Bharat AI assistant. How can I help you with government services today?'
    };

    // Initialize state directly from localStorage for persistent memory
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('smart_bharat_chat_history');
        return savedMessages ? JSON.parse(savedMessages) : [welcomeMessage];
    });

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('English');

    const chatEndRef = useRef(null);

    // Auto-scroll to latest message when the history updates
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Effect to write history changes into localStorage persistently
    useEffect(() => {
        localStorage.setItem('smart_bharat_chat_history', JSON.stringify(messages));
    }, [messages]);

    // Voice Recognition Setup (Web Speech API)
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice input is not supported in this browser. Please use Chrome.");
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = language === 'Telugu' ? 'te-IN' : language === 'Hindi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => setInput(event.results[0][0].transcript);
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    const sendMessage = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsListening(false);
        setIsLoading(true);

        try {
            // Instruct Gemini to reply in the selected language contextually
            const contextualPrompt = `Please reply in ${language}. User says: ${userMessage.text}`;

            // Enterprise best practice: Use deployed URL if available, fallback to localhost
            const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://smart-bharat-api.vercel.app';

            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: contextualPrompt }),
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { sender: 'bot', text: data.reply || "Network error. Please try again." }]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: 'bot', text: "Server error. Ensure your backend service is reachable." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear history action utility function to give users full control
    const clearChatHistory = () => {
        if (window.confirm("Are you sure you want to clear your conversation history?")) {
            setMessages([welcomeMessage]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden relative" aria-label="AI Chat Assistant">

            {/* Sub-Header Settings & Utility Control Strip */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-100 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                    <Globe size={14} aria-hidden="true" />
                    <label htmlFor="language-select" className="sr-only">Select Language</label>
                    <span aria-hidden="true">Language:</span>
                    <select
                        id="language-select"
                        aria-label="Select AI Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-transparent font-medium text-blue-600 outline-none cursor-pointer ml-1"
                    >
                        <option value="English">English</option>
                        <option value="Hindi">हिंदी (Hindi)</option>
                        <option value="Telugu">తెలుగు (Telugu)</option>
                    </select>
                </div>

                {/* Clear button to manage persistent storage entries */}
                <button
                    onClick={clearChatHistory}
                    aria-label="Clear chat memory"
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title="Clear chat memory"
                >
                    <Trash2 size={15} aria-hidden="true" />
                </button>
            </div>

            {/* Dynamic Scrolling Chat Sandbox Window - aria-live announces new messages automatically */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                aria-live="polite"
                role="log"
                aria-label="Chat History"
            >
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start" aria-live="assertive">
                        <div className="bg-gray-100 text-gray-500 p-3 rounded-2xl rounded-tl-none text-sm animate-pulse border border-gray-200">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Dynamic Command Area Form */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
                <button
                    type="button"
                    onClick={startListening}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                    aria-pressed={isListening}
                    className={`p-2 rounded-full transition-all duration-200 ${isListening
                        ? 'bg-red-100 text-red-600 animate-pulse scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    title={isListening ? "Stop listening" : "Click to speak"}
                >
                    <Mic size={18} aria-hidden="true" />
                </button>

                <label htmlFor="chat-input" className="sr-only">Type your message to Smart Bharat</label>
                <input
                    id="chat-input"
                    type="text"
                    aria-label="Type your message to Smart Bharat"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening closely..." : "Ask your question..."}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    aria-label="Send message"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
                >
                    <Send size={18} className="ml-0.5" aria-hidden="true" />
                </button>
            </form>
        </div>
    );
}

export default ChatBot;