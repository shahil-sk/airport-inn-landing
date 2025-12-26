import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '@/services/api';
import { Room } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Wifi, 
  Tv, 
  Coffee, 
  Bath, 
  Users, 
  Maximize, 
  Star,
  Snowflake,
  Wind,
  Bed,
  Calendar,
  MapPin
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-5 h-5" />,
  'Free WiFi': <Wifi className="w-5 h-5" />,
  'TV': <Tv className="w-5 h-5" />,
  'LCD TV': <Tv className="w-5 h-5" />,
  'Mini Bar': <Coffee className="w-5 h-5" />,
  'Coffee Maker': <Coffee className="w-5 h-5" />,
  'Bathtub': <Bath className="w-5 h-5" />,
  'Shower': <Bath className="w-5 h-5" />,
  'Attached Bathroom': <Bath className="w-5 h-5" />,
  'Air Conditioning': <Snowflake className="w-5 h-5" />,
  'AC': <Snowflake className="w-5 h-5" />,
  'Fan': <Wind className="w-5 h-5" />,
  'King Size Bed': <Bed className="w-5 h-5" />,
  'Queen Size Bed': <Bed className="w-5 h-5" />,
};

const RoomView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['room', id],
    queryFn: () => roomsApi.getById(Number(id)),
    enabled: !!id,
  });

  const room = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onLoginClick={() => {}} onRegisterClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-background">
        <Header onLoginClick={() => {}} onRegisterClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              Room not found. Please check the room ID and try again.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : [room.thumbnail].filter(Boolean);
  const facilities = room.facilities || [];

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => {}} onRegisterClick={() => {}} />
      
      <main>
        {/* Header Section */}
        <div className="bg-secondary/50 py-8">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rooms
            </Button>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
              {room.title}
            </h1>
            <p className="text-muted-foreground text-lg">{room.short_tagline || room.category_name}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Description */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              {images.length > 0 && (
                <div className="mb-6">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    <img
                      src={images[selectedImage] || images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Image Thumbnails */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? 'border-primary'
                              : 'border-transparent hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${room.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h2 className="font-display text-2xl font-semibold mb-4">About This Room</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {room.long_description || room.short_tagline || 'No description available.'}
                  </p>
                </CardContent>
              </Card>

              {/* Facilities */}
              {facilities.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="font-display text-2xl font-semibold mb-4">Facilities & Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {facilities.map((facility, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                        >
                          {amenityIcons[facility] || <Star className="w-5 h-5" />}
                          <span className="text-sm font-medium">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      {room.offer_percentage > 0 && (
                        <span className="text-2xl font-bold text-muted-foreground line-through">
                          ₹{room.price}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-primary">
                        ₹{room.final_price || room.price}
                      </span>
                      <span className="text-muted-foreground">/ night</span>
                    </div>
                    {room.offer_percentage > 0 && (
                      <Badge variant="default" className="mb-4">
                        {room.offer_percentage}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm">{room.room_number}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span className="text-sm">Category: {room.category_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">
                        {room.is_available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>

                  <Link to={`/book/${room.room_id}`} className="block">
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-full"
                      disabled={!room.is_available}
                    >
                      {room.is_available ? 'Book Now' : 'Not Available'}
                    </Button>
                  </Link>

                  {!room.is_available && (
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      This room is currently not available for booking.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoomView;

