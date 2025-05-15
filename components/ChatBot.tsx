'use client';

import { MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Add TypeScript declaration for window.voiceflow
declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: any) => void;
        destroy: () => void;
        open: () => void;
        close: () => void;
      };
    };
  }
}

interface ChatBotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ChatBot = ({ isOpen, setIsOpen }: ChatBotProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Load the script only once when component mounts
  useEffect(() => {
    if (!scriptLoaded) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
      
      script.onload = () => {
        setScriptLoaded(true);
      };
      
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [scriptLoaded]);
  
  // Initialize Voiceflow when script is loaded and container is available
  useEffect(() => {
    if (scriptLoaded && chatContainerRef.current && window.voiceflow) {
      window.voiceflow.chat.load({
        verify: { projectID: '68254e1df0bf73b7df88a2ce' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: {
          url: "https://runtime-api.voiceflow.com"
        },
        render: {
          mode: 'embedded',
          target: chatContainerRef.current,
          style: {
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            height: '100%',
            width: '100%',
          }
        }
      });
    }
  }, [scriptLoaded, chatContainerRef.current]);
  
  // Handle visibility of chat based on isOpen state
  useEffect(() => {
    if (window.voiceflow?.chat) {
      if (isOpen) {
        // Make sure the chat container is visible
        if (chatContainerRef.current) {
          chatContainerRef.current.style.display = 'block';
        }
      } else {
        // Hide the chat container
        if (chatContainerRef.current) {
          chatContainerRef.current.style.display = 'none';
        }
      }
    }
  }, [isOpen]);
  
  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50 flex items-center justify-center"
        aria-label="Chat with Library Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      
      {/* Chat Container - Always in DOM but visibility controlled by CSS */}
      <div 
        className={`fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
      >
        {/* Voiceflow will be embedded in this div */}
        <div ref={chatContainerRef} className="h-[500px] overflow-hidden"></div>
      </div>
    </>
  );
}

export default ChatBot; 