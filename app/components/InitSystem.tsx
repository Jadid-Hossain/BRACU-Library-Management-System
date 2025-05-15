'use client';

import { useEffect, useState } from 'react';

export default function InitSystem() {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const initSystem = async () => {
      try {
        const response = await fetch('/api/init-db');
        const data = await response.json();
        
        if (data.success) {
          console.log('System initialized successfully');
          setInitialized(true);
        } else {
          console.error('System initialization failed:', data.error);
        }
      } catch (error) {
        console.error('Error initializing system:', error);
      }
    };
    
    initSystem();
  }, []);
  
  // This component doesn't render anything visible
  return null;
} 