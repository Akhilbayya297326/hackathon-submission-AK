import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Globe } from 'lucide-react';

function ChatBot() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Namaste! I am your Smart Bharat AI assistant. How can I help you with government services today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('English');

    const chatEndRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            // Instruct Gemini to reply in the selected language
            const contextualPrompt = `Please reply in ${language}. User says: ${userMessage.text}`;

            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: contextualPrompt }),
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { sender: 'bot', text: data.reply || "Network error." }]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: 'bot', text: "Server error." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden relative">

            {/* Settings Bar */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-100 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                    <Globe size={14} />
                    <span>Language:</span>
                </div>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent font-medium text-blue-600 outline-none cursor-pointer"
                >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                </select>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                                : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-500 p-3 rounded-2xl rounded-tl-none text-sm animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
                <button
                    type="button"
                    onClick={startListening}
                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    title="Click to speak"
                >
                    <Mic size={18} />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Ask your question..."}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                    <Send size={18} className="ml-1" />
                </button>
            </form>
        </div>
    );
}

export default ChatBot;