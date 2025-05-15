'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { MailIcon, PhoneIcon, UserIcon, MessageSquareIcon } from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
  status: 'new' | 'read';
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/contact-messages');
        
        if (!response.ok) {
          throw new Error(`Error fetching messages: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Failed to fetch contact messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  // Filter messages based on active tab
  const filteredMessages = activeTab === 'all' 
    ? messages 
    : activeTab === 'new' 
      ? messages.filter(msg => msg.status === 'new')
      : messages.filter(msg => msg.status === 'read');

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'read' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      // Update the local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status: 'read' } : msg
      ));
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-muted-foreground">
          View and manage messages from the contact form.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All Messages ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="new">
            New Messages ({messages.filter(m => m.status === 'new').length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read Messages ({messages.filter(m => m.status === 'read').length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {renderMessages(filteredMessages, loading, error, markAsRead)}
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          {renderMessages(filteredMessages, loading, error, markAsRead)}
        </TabsContent>
        
        <TabsContent value="read" className="space-y-4">
          {renderMessages(filteredMessages, loading, error, markAsRead)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderMessages(
  messages: ContactMessage[], 
  loading: boolean, 
  error: string | null,
  markAsRead: (id: number) => Promise<void>
) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="bg-gray-50 text-gray-600 p-8 rounded-md text-center">
        <MessageSquareIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No messages found</h3>
        <p>There are no messages in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`bg-white p-6 rounded-lg shadow-sm border ${
            message.status === 'new' ? 'border-blue-300' : 'border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-500">
                <UserIcon size={18} />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">{message.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  {format(new Date(message.created_at), 'MMM d, yyyy • h:mm a')}
                  {message.status === 'new' && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {message.status === 'new' && (
              <button
                onClick={() => markAsRead(message.id)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark as read
              </button>
            )}
          </div>
          
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{message.message}</p>
          
          <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center text-sm text-gray-500">
              <MailIcon size={16} className="mr-2" />
              <a href={`mailto:${message.email}`} className="hover:text-blue-600">
                {message.email}
              </a>
            </div>
            
            {message.phone && (
              <div className="flex items-center text-sm text-gray-500 sm:ml-4">
                <PhoneIcon size={16} className="mr-2" />
                <a href={`tel:${message.phone}`} className="hover:text-blue-600">
                  {message.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 