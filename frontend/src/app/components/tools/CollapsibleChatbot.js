import React, { useState, useRef } from 'react';

const CollapsibleChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to the OTT Fan Insights Chatbot! I can answer questions about sports fans' streaming service usage and spending patterns. What would you like to know?"
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Scroll to bottom of messages
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Clear chat function
  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Welcome to the OTT Fan Insights Chatbot! I can answer questions about sports fans' streaming service usage and spending patterns. What would you like to know?"
      }
    ]);
  };

  // Handle user input
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);

    // Clear input field
    const userQuery = input;
    setInput('');

    // Show thinking state
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'assistant', content: "Thinking...", isLoading: true }]);

    try {
      // Call the API endpoint
      const response = await fetch('/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userQuery }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { answer, error } = await response.json();

      // Update the message
      setMessages(prev => {
        const newMessages = [...prev];
        if (error) {
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: `I'm sorry, I encountered an error: ${error}`
          };
        } else {
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: answer
          };
        }
        return newMessages;
      });
    } catch (error) {
      console.error('Error processing query:', error);

      // Update with error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: "I'm sorry, I encountered an error while processing your request. Please try again."
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sample questions to suggest to users
  const suggestedQuestions = [
    "What are the most popular streaming services?",
    "How many NBA fans are there?",
    "What's the average spend for NFL fans?",
    "What is the net change in streaming subscriptions?",
    "Compare the top streaming services"
  ];

  // Add suggested question to input
  const addSuggestedQuestion = (question) => {
    setInput(question);
  };

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Component for the chat button
  const ChatButton = () => (
    <div
      onClick={toggleChat}
      className="fixed bottom-5 right-5 w-[600px] h-16 rounded-lg shadow-lg cursor-pointer overflow-hidden"
      style={{
        backgroundImage: "url('/SIL_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        filter: 'grayscale(100%)'
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-white font-bold bg-black bg-opacity-30 hover:bg-opacity-20 transition-all text-lg">
        Try Out Our New OTT Fan Insights AI Chatbot!
      </div>
    </div>
  );

  if (!isOpen) {
    return <ChatButton />;
  }

  return (
    <div className="fixed bottom-5 right-5 w-[600px] h-[1000px] bg-white rounded-lg shadow-xl flex flex-col z-50">
      <div
        className="bg-[#e86f0c] text-white p-4 rounded-t-lg flex justify-between items-center"
        style={{
          backgroundImage: "url('/SIL_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'grayscale(100%)'
        }}
      >
        <h1 className="text-lg font-bold">OTT Fan Insights</h1>
        <button
          onClick={toggleChat}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-0">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}>
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-[#e86f0c] text-white' 
                  : message.isLoading
                    ? 'bg-gray-100 text-gray-600 animate-pulse'
                    : 'bg-gray-200 text-gray-800'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {message.isLoading && message.content === "Thinking..."
                  ? "Thinking" + Array(3).fill('.').map((_, i) =>
                      `${i < (Math.floor(Date.now() / 500) % 4) ? '.' : ''}`
                    ).join('')
                  : message.content
                }
              </pre>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {/* Suggested Questions Section */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">Try asking:</div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => addSuggestedQuestion(question)}
                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded-full truncate"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-2 text-center">
        <button
          onClick={clearChat}
          className="text-sm text-[#e86f0c] hover:text-[#9f0909] focus:outline-none mb-2"
        >
          Clear Chat
        </button>
      </div>

      <div className="border-t p-4 pt-2">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none"
            placeholder="Ask about OTT fan data..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-2 rounded-r ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#e86f0c] hover:bg-orange-700'
            } text-white`}
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollapsibleChatbot;