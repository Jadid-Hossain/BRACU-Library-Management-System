'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export const NotificationInitializer = () => {
  const { data: session, status } = useSession();
  const [initialized, setInitialized] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);

  useEffect(() => {
    // Only initialize if authenticated and not already initialized
    // Also limit retry attempts to prevent excessive API calls
    if (status === 'authenticated' && !initialized && initAttempts < 3) {
      const initializeNotifications = async () => {
        try {
          // Increment attempt counter
          setInitAttempts(prev => prev + 1);
          
          const response = await fetch('/api/init', {
            method: 'GET',
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            console.log('Notifications initialized successfully');
            setInitialized(true);
          } else {
            console.error('Failed to initialize notifications:', await response.text());
          }
        } catch (error) {
          console.error('Failed to initialize notifications:', error);
        }
      };

      // Add a small delay to ensure everything is loaded
      const timeout = setTimeout(() => {
        initializeNotifications();
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [status, initialized, initAttempts]);

  // This component doesn't render anything
  return null;
}; 