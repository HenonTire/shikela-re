/**
 * @file app/courier/messages/page.tsx
 * @description Courier messaging/communication page
 * 
 * Features:
 * - Conversations with stores and customers
 * - Real-time message updates (future: WebSocket)
 * - Message history
 * - Quick delivery updates
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Search } from 'lucide-react';
import { DeliveryMessage } from '@/lib/types';
import { storage } from '@/lib/storage';

/**
 * CourierMessages Component
 * Handles communication with stores and customers
 */
export default function CourierMessages() {
  const [messages, setMessages] = useState<DeliveryMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const courierId = localStorage.getItem('courierId');
    if (courierId) {
      const allMessages = storage.getAll<DeliveryMessage>('deliveryMessages');
      const courierMessages = allMessages.filter(m =>
        m.senderId === courierId || m.deliveryId
      );
      setMessages(courierMessages);
    }
  }, []);

  const conversations = [...new Set(messages.map(m => m.deliveryId))];

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: DeliveryMessage = {
      id: `msg_${Date.now()}`,
      deliveryId: selectedConversation,
      senderId: localStorage.getItem('courierId') || '',
      senderRole: 'courier',
      message: messageText,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    storage.create('deliveryMessages', newMessage);
    setMessageText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate with stores and customers</p>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="p-4 overflow-y-auto">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            {conversations.length > 0 ? (
              conversations.map((convId) => {
                const convMessages = messages.filter(m => m.deliveryId === convId);
                const lastMessage = convMessages[convMessages.length - 1];

                return (
                  <button
                    key={convId}
                    onClick={() => setSelectedConversation(convId)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation === convId
                        ? 'bg-blue-100 border-l-4 border-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-medium text-gray-900">Delivery {convId.slice(-6)}</p>
                    <p className="text-xs text-gray-600 truncate">{lastMessage?.message}</p>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No messages yet</p>
              </div>
            )}
          </div>
        </Card>

        {/* Messages View */}
        <div className="col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages */}
              <Card className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages
                  .filter(m => m.deliveryId === selectedConversation)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderRole === 'courier' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderRole === 'courier'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </Card>

              {/* Message Input */}
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} className="gap-2">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <Card className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select a conversation to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
