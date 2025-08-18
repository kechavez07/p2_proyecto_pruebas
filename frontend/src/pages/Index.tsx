import React from 'react';
import Header from '@/components/Header';
import PinGrid from '@/components/PinGrid';
import UploadModal from '@/components/UploadModal';
import { useEffect, useState } from 'react';

const Index = () => {
  const [hasSession, setHasSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) setHasSession(false);
  }, []);

  if (!hasSession) {
    return <div className="p-8 text-center text-red-500">No hay sesión activa</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <UploadModal />
          </div>
        </div>
        <PinGrid />
      </main>
    </div>
  );
};

export default Index;
