"use client";
import React, { useState, useEffect, JSX } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import LoginPage from './(auth)/login/page';
import ChatroomPage from '@/components/ChatroomList';
import AppLayout from '@/components/AppLayout';

// Main App Component
export default function App(): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hash, setHash] = useState<string>('');
  useEffect(() => {
    // Add Tailwind CSS CDN script to the head
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(script);
    
    setHash(window.location.hash);
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      document.head.removeChild(script);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderContent = (): JSX.Element => {
    if (!isAuthenticated) {
      return <LoginPage />;
    }

    const isChatRoute = hash.startsWith('#chat/');
    const chatId = isChatRoute ? hash.split('/')[1] : null;
    
    return (
     isAuthenticated && <AppLayout>
        <ChatroomPage chatId={chatId ?? ''} />
      </AppLayout>
    );
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {renderContent()}
    </>
  );
}

