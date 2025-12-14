import { useState } from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import RoomCategories from '@/components/RoomCategories';
import RoomListings from '@/components/RoomListings';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  const handleLoginClick = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  const handleRegisterClick = () => {
    setAuthModal({ isOpen: true, mode: 'register' });
  };

  const handleCloseModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  const handleSwitchMode = () => {
    setAuthModal({ ...authModal, mode: authModal.mode === 'login' ? 'register' : 'login' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <main>
        <HeroBanner />
        <RoomCategories />
        <RoomListings />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={handleCloseModal}
        mode={authModal.mode}
        onSwitchMode={handleSwitchMode}
      />
    </div>
  );
};

export default Index;
