import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import RoomCategories from '@/components/RoomCategories';
import RoomListings from '@/components/RoomListings';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <RoomCategories />
        <RoomListings />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
