import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Wifi, Tv, Coffee, Bath, Users, Maximize, Star } from 'lucide-react';
import { roomsApi, Room } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  TV: <Tv className="w-4 h-4" />,
  'Mini Bar': <Coffee className="w-4 h-4" />,
  'Coffee Maker': <Coffee className="w-4 h-4" />,
  Bathtub: <Bath className="w-4 h-4" />,
  Shower: <Bath className="w-4 h-4" />,
};

const RoomListings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsApi.getAll(),
  });

  const rooms = data?.data?.rooms || [];

  if (isLoading) {
    return (
      <section id="rooms" className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-8 w-96 mx-auto mb-2" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !rooms.length) {
    return (
      <section id="rooms" className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">No rooms available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

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
                  src={room.thumbnail || '/placeholder.svg'}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="px-2 sm:px-3 py-1 bg-primary text-primary-foreground text-[10px] sm:text-xs font-medium rounded-full">
                    {room.category_name}
                  </span>
                </div>

                {/* Availability Badge */}
                {!room.is_available && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="px-2 sm:px-3 py-1 bg-red-500 text-white text-[10px] sm:text-xs font-medium rounded-full">
                      Unavailable
                    </span>
                  </div>
                )}

                {/* Quick Book Button - Shows on Hover (hidden on mobile, always visible via bottom button) */}
                {room.is_available && (
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hidden sm:block">
                    <Link to={`/book/${room.room_id}`}>
                      <Button variant="default" className="w-full">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                  {room.title}
                </h3>
                
                {room.short_tagline && (
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                    {room.short_tagline}
                  </p>
                )}

                {/* Amenities */}
                {room.facilities && room.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {room.facilities.slice(0, 4).map((facility, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary text-secondary-foreground text-[10px] sm:text-xs rounded-md"
                      >
                        {amenityIcons[facility] || null}
                        {facility}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                  <div>
                    {room.offer_percentage > 0 ? (
                      <>
                        <span className="text-lg sm:text-xl font-bold text-primary line-through text-muted-foreground">
                          ₹{room.price}
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-primary ml-2">
                          ₹{room.final_price}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl sm:text-2xl font-bold text-primary">
                        ₹{room.final_price || room.price}
                      </span>
                    )}
                    <span className="text-muted-foreground text-xs sm:text-sm"> / night</span>
                  </div>
                  <Link to={`/room/${room.room_id}`}>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RoomListings;
