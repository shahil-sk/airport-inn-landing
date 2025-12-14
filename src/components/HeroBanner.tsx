import { Button } from '@/components/ui/button';
import { Calendar, Users, Search } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const HeroBanner = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury suite at Tree Suites Next Airport Inn"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/90 via-forest/70 to-forest-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 sm:pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gold/20 backdrop-blur-sm text-gold-light rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-gold/30">
              ★ Premium Airport Lodge Experience
            </span>
          </div>
          
          <h1 className="animate-fade-up font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight px-2" style={{ animationDelay: '0.2s' }}>
            Where Nature Meets
            <span className="block text-gold-light">Luxury Comfort</span>
          </h1>
          
          <p className="animate-fade-up text-primary-foreground/80 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4" style={{ animationDelay: '0.3s' }}>
            Experience unparalleled comfort just minutes from the airport. Your perfect stay awaits among the trees at Tree Suites Next Airport Inn.
          </p>

          <div className="animate-fade-up flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16 px-4" style={{ animationDelay: '0.4s' }}>
            <Button variant="gold" size="lg" className="group w-full sm:w-auto">
              Book Your Stay
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Button>
            <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
              Explore Rooms
            </Button>
          </div>
        </div>

        {/* Search Box */}
        <div className="animate-fade-up max-w-5xl mx-auto px-2 sm:px-0" style={{ animationDelay: '0.5s' }}>
          <div className="bg-background/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-card p-4 sm:p-6 border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Check-in
                </label>
                <input
                  type="date"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Check-out
                </label>
                <input
                  type="date"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Guests
                </label>
                <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                </select>
              </div>
              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <Button variant="gold" size="lg" className="w-full">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Search Rooms
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
