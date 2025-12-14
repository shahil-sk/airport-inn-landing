import { Button } from '@/components/ui/button';
import { Wifi, Tv, Coffee, Bath, Users, Maximize, Star } from 'lucide-react';

import roomSuite from '@/assets/room-suite.jpg';
import roomMiniSuite from '@/assets/room-mini-suite.jpg';
import roomJuniorSuite from '@/assets/room-junior-suite.jpg';
import roomDeluxeAc from '@/assets/room-deluxe-ac.jpg';
import roomDeluxeNonAc from '@/assets/room-deluxe-nonac.jpg';

interface Room {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  size: string;
  guests: number;
  rating: number;
  amenities: string[];
}

const rooms: Room[] = [
  {
    id: 1,
    name: 'Royal Suite Premium',
    category: 'Suite Room',
    price: 299,
    image: roomSuite,
    size: '85 sqm',
    guests: 4,
    rating: 4.9,
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Bathtub'],
  },
  {
    id: 2,
    name: 'Elegant Mini Suite',
    category: 'Mini Suite Room',
    price: 199,
    image: roomMiniSuite,
    size: '55 sqm',
    guests: 2,
    rating: 4.7,
    amenities: ['WiFi', 'TV', 'Coffee Maker', 'Shower'],
  },
  {
    id: 3,
    name: 'Cozy Junior Suite',
    category: 'Junior Suite Room',
    price: 159,
    image: roomJuniorSuite,
    size: '45 sqm',
    guests: 2,
    rating: 4.6,
    amenities: ['WiFi', 'TV', 'Work Desk', 'Shower'],
  },
  {
    id: 4,
    name: 'Comfort Deluxe AC',
    category: 'Deluxe AC Room',
    price: 99,
    image: roomDeluxeAc,
    size: '35 sqm',
    guests: 2,
    rating: 4.5,
    amenities: ['WiFi', 'TV', 'AC', 'Shower'],
  },
  {
    id: 5,
    name: 'Classic Deluxe',
    category: 'Deluxe Non-AC Room',
    price: 69,
    image: roomDeluxeNonAc,
    size: '32 sqm',
    guests: 2,
    rating: 4.4,
    amenities: ['WiFi', 'TV', 'Fan', 'Shower'],
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  TV: <Tv className="w-4 h-4" />,
  'Mini Bar': <Coffee className="w-4 h-4" />,
  'Coffee Maker': <Coffee className="w-4 h-4" />,
  Bathtub: <Bath className="w-4 h-4" />,
  Shower: <Bath className="w-4 h-4" />,
};

const RoomListings = () => {
  return (
    <section id="rooms" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gold/10 text-gold-dark rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Our Accommodations
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Featured Rooms
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4">
            Discover our handpicked selection of rooms designed for your comfort and convenience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="group bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="px-2 sm:px-3 py-1 bg-primary text-primary-foreground text-[10px] sm:text-xs font-medium rounded-full">
                    {room.category}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-gold text-gold" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">{room.rating}</span>
                </div>

                {/* Quick Book Button - Shows on Hover (hidden on mobile, always visible via bottom button) */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hidden sm:block">
                  <Button variant="gold" className="w-full">
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                  {room.name}
                </h3>
                
                {/* Room Info */}
                <div className="flex items-center gap-3 sm:gap-4 text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                  <span className="flex items-center gap-1">
                    <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {room.size}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {room.guests} Guests
                  </span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary text-secondary-foreground text-[10px] sm:text-xs rounded-md"
                    >
                      {amenityIcons[amenity] || null}
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-primary">${room.price}</span>
                    <span className="text-muted-foreground text-xs sm:text-sm"> / night</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Button variant="default" size="lg">
            View All Rooms
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoomListings;
