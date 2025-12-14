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
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative animate-fade-up">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={aboutLodge}
                alt="Tree Suites Next Airport Inn exterior"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/40 via-transparent to-transparent" />
            </div>
            
            {/* Stats Overlay */}
            <div className="absolute -bottom-6 -right-6 md:right-6 bg-card rounded-2xl shadow-card p-6 border border-border">
              <div className="flex gap-8">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-primary font-display">15+</span>
                  <span className="text-sm text-muted-foreground">Years Experience</span>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <span className="block text-3xl font-bold text-gold font-display">50+</span>
                  <span className="text-sm text-muted-foreground">Luxury Rooms</span>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/20 rounded-full blur-2xl" />
          </div>

          {/* Content Side */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              About Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Your Home Away
              <span className="block text-gold">From Home</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Tree Suites Next Airport Inn is a premium lodge nestled in the serene embrace of nature, 
              offering the perfect blend of convenience and tranquility. Located just minutes from the 
              airport, we provide weary travelers with a peaceful retreat surrounded by majestic trees 
              and lush greenery.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our commitment to exceptional hospitality, combined with modern amenities and 
              eco-friendly practices, makes us the ideal choice for both business and leisure travelers 
              seeking comfort without compromising on convenience.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl bg-card shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
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
