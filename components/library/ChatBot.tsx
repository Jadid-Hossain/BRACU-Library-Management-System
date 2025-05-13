'use client';

import { MessageCircle, X } from 'lucide-react';

interface ChatBotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ChatBot = ({ isOpen, setIsOpen }: ChatBotProps) => {
  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-[var(--primary-color)] text-white p-4 rounded-full shadow-lg hover:bg-[var(--secondary-color)] transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Ask CHICKEN</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="h-96 overflow-y-auto p-4">
            {/* Chat messages would go here */}
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="text-sm">Hello! I'm CHICKEN, your library assistant. How can I help you today?</p>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
              <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)]">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;