'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Sparkles } from 'lucide-react';
import { storage } from '@/lib/storage';
import { ChatMessage } from '@/lib/types';
import { AI_QUICK_SUGGESTIONS, AI_SAMPLE_RESPONSES } from '@/lib/constants';

/**
 * AIChat Component
 * 
 * Purpose: Provides a chat interface for Shikela AI assistant
 * Features:
 * - Message history with localStorage persistence
 * - Quick suggestion buttons
 * - Sample AI responses for demo purposes
 * - Auto-scroll to latest messages
 * 
 * State Management:
 * - messages: Current conversation history
 * - inputValue: User's current input
 * - isLoading: Show loading state while processing
 * 
 * Storage: Reads/writes to 'aiChatHistory' localStorage key
 */
export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return storage.getAll<ChatMessage>('aiChatHistory');
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handles sending a message
   * Creates user message, saves to localStorage, generates AI response
   */
  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    // Save user message
    setMessages(prev => [...prev, userMessage]);
    storage.create('aiChatHistory', userMessage);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response with sample data
    setTimeout(() => {
      const aiResponses = [
        AI_SAMPLE_RESPONSES.addProducts,
        AI_SAMPLE_RESPONSES.shipping,
        AI_SAMPLE_RESPONSES.sales,
        "I'm Shikela AI, your personal store assistant. I can help you with managing products, payments, shipping, and growing your business. What would you like to know?"
      ];

      const aiMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      storage.create('aiChatHistory', aiMessage);
      setIsLoading(false);
    }, 500);
  };

  /**
   * Handles quick suggestion button clicks
   */
  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  /**
   * Clears chat history
   */
  const handleClearHistory = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([]);
      storage.clear('aiChatHistory');
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Welcome to Shikela AI</h3>
              <p className="text-sm text-gray-600 mt-1">
                I&apos;m here to help you manage your store and grow your business
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Suggestions */}
      {messages.length === 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">Suggestions:</p>
          <div className="grid grid-cols-1 gap-2">
            {AI_QUICK_SUGGESTIONS.slice(0, 3).map(suggestion => (
              <Button
                key={suggestion}
                variant="outline"
                className="justify-start text-left h-auto py-2 px-3 text-sm"
                onClick={() => handleQuickSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask me anything about your store..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Clear History Button */}
      {messages.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            className="text-xs text-gray-500"
          >
            Clear History
          </Button>
        </div>
      )}
    </div>
  );
}
