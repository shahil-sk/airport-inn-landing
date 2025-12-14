import { MapPin, Plane, TreePine, Award, Clock, Shield } from 'lucide-react';
import aboutLodge from '@/assets/about-lodge.jpg';

const features = [
  {
    icon: Plane,
    title: 'Airport Proximity',
    description: 'Just 5 minutes from the main airport terminal',
  },
  {
    icon: TreePine,
    title: 'Natural Setting',
    description: 'Surrounded by lush greenery and tranquil forests',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized for excellence in hospitality',
  },
  {
    icon: Clock,
    title: '24/7 Service',
    description: 'Round-the-clock concierge and room service',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Advanced security for your peace of mind',
  },
  {
    icon: MapPin,
    title: 'Prime Location',
    description: 'Easy access to city attractions and business hubs',
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Side */}
          <div className="relative animate-fade-up order-2 lg:order-1">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-card">
              <img
                src={aboutLodge}
                alt="Tree Suites Next Airport Inn exterior"
                className="w-full h-[280px] sm:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/40 via-transparent to-transparent" />
            </div>
            
            {/* Stats Overlay */}
            <div className="absolute -bottom-4 sm:-bottom-6 left-4 right-4 sm:left-auto sm:right-6 bg-card rounded-xl sm:rounded-2xl shadow-card p-4 sm:p-6 border border-border">
              <div className="flex gap-6 sm:gap-8 justify-center sm:justify-start">
                <div className="text-center">
                  <span className="block text-2xl sm:text-3xl font-bold text-primary font-display">15+</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">Years Experience</span>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <span className="block text-2xl sm:text-3xl font-bold text-gold font-display">50+</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">Luxury Rooms</span>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-4 -left-4 w-16 sm:w-24 h-16 sm:h-24 bg-gold/20 rounded-full blur-2xl" />
          </div>

          {/* Content Side */}
          <div className="animate-fade-up order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              About Us
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Your Home Away
              <span className="block text-gold">From Home</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
              Tree Suites Next Airport Inn is a premium lodge nestled in the serene embrace of nature, 
              offering the perfect blend of convenience and tranquility. Located just minutes from the 
              airport, we provide weary travelers with a peaceful retreat surrounded by majestic trees 
              and lush greenery.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              Our commitment to exceptional hospitality, combined with modern amenities and 
              eco-friendly practices, makes us the ideal choice for both business and leisure travelers 
              seeking comfort without compromising on convenience.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-card shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1">{feature.title}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
