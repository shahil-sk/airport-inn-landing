import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { roomsApi, bookingsApi } from '@/services/api';
import { BookingRequest } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ArrowLeft, Calendar as CalendarIcon, User, Mail, Phone, Users, Baby } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const BookNow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  // Get dates from URL params if available
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');

  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    checkInParam ? new Date(checkInParam) : undefined
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    checkOutParam ? new Date(checkOutParam) : undefined
  );
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    check_in_time: '14:00',
    check_out_time: '11:00',
    num_adults: 1,
    num_minors: 0,
    payment_method: 'pay_at_property' as 'upi' | 'pay_at_property',
    upi_app: '',
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.mobile || '',
      }));
    }
  }, [user]);

  const { data: roomData, isLoading: roomLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: () => roomsApi.getById(Number(id)),
    enabled: !!id,
  });

  const room = roomData?.data;

  const bookingMutation = useMutation({
    mutationFn: (bookingData: BookingRequest) => bookingsApi.create(bookingData),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: 'Booking Successful!',
          description: `Your booking ID is ${response.data?.booking_id}. We'll contact you soon.`,
        });
        navigate('/');
      } else {
        toast({
          title: 'Booking Failed',
          description: response.error || 'Please try again.',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      toast({
        title: 'Date Required',
        description: 'Please select check-in and check-out dates.',
        variant: 'destructive',
      });
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast({
        title: 'Invalid Dates',
        description: 'Check-out date must be after check-in date.',
        variant: 'destructive',
      });
      return;
    }

    const bookingData: BookingRequest = {
      room_id: Number(id!),
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      check_in_date: format(checkInDate, 'yyyy-MM-dd'),
      check_in_time: formData.check_in_time,
      check_out_date: format(checkOutDate, 'yyyy-MM-dd'),
      check_out_time: formData.check_out_time,
      num_adults: formData.num_adults,
      num_minors: formData.num_minors,
      payment_method: formData.payment_method,
      upi_app: formData.payment_method === 'upi' ? formData.upi_app : undefined,
      minor_ages: [],
    };

    bookingMutation.mutate(bookingData);
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!room) return 0;
    const nights = calculateNights();
    return (room.final_price || room.price) * nights;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onLoginClick={() => {}} onRegisterClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Header onLoginClick={() => {}} onRegisterClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Room not found.</AlertDescription>
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

  if (!room.is_available) {
    return (
      <div className="min-h-screen bg-background">
        <Header onLoginClick={() => {}} onRegisterClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>This room is not available for booking.</AlertDescription>
          </Alert>
          <Button onClick={() => navigate(`/room/${id}`)} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Room Details
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const nights = calculateNights();
  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => {}} onRegisterClick={() => {}} />
      
      <main>
        <div className="bg-secondary/50 py-8">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/room/${id}`)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Room
            </Button>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Book {room.title}
            </h1>
            <p className="text-muted-foreground">{room.room_number} • {room.category_name}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:py-12">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Booking Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </Label>
                      <Input
                        id="full_name"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Dates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Check-in Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !checkInDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkInDate ? format(checkInDate, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkInDate}
                              onSelect={setCheckInDate}
                              disabled={(date) => date < today}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Check-out Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !checkOutDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkOutDate ? format(checkOutDate, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkOutDate}
                              onSelect={setCheckOutDate}
                              disabled={(date) => date < (checkInDate || today)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="check_in_time">Check-in Time</Label>
                        <Input
                          id="check_in_time"
                          type="time"
                          value={formData.check_in_time}
                          onChange={(e) => setFormData({ ...formData, check_in_time: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="check_out_time">Check-out Time</Label>
                        <Input
                          id="check_out_time"
                          type="time"
                          value={formData.check_out_time}
                          onChange={(e) => setFormData({ ...formData, check_out_time: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Guests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Number of Guests</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="num_adults">
                          <Users className="w-4 h-4 inline mr-2" />
                          Adults *
                        </Label>
                        <Input
                          id="num_adults"
                          type="number"
                          min="1"
                          required
                          value={formData.num_adults}
                          onChange={(e) => setFormData({ ...formData, num_adults: parseInt(e.target.value) || 1 })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="num_minors">
                          <Baby className="w-4 h-4 inline mr-2" />
                          Children
                        </Label>
                        <Input
                          id="num_minors"
                          type="number"
                          min="0"
                          value={formData.num_minors}
                          onChange={(e) => setFormData({ ...formData, num_minors: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="payment_method">Payment Method *</Label>
                      <Select
                        value={formData.payment_method}
                        onValueChange={(value: 'upi' | 'pay_at_property') =>
                          setFormData({ ...formData, payment_method: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pay_at_property">Pay at Property</SelectItem>
                          <SelectItem value="upi">UPI Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.payment_method === 'upi' && (
                      <div>
                        <Label htmlFor="upi_app">UPI App</Label>
                        <Input
                          id="upi_app"
                          value={formData.upi_app}
                          onChange={(e) => setFormData({ ...formData, upi_app: e.target.value })}
                          placeholder="GPay, PhonePe, Paytm, etc."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Booking Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {room.thumbnail && (
                      <img
                        src={room.thumbnail}
                        alt={room.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}

                    <div>
                      <h3 className="font-semibold text-lg mb-2">{room.title}</h3>
                      <p className="text-sm text-muted-foreground">{room.room_number}</p>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price per night</span>
                        <span>₹{room.final_price || room.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nights</span>
                        <span>{nights}</span>
                      </div>
                      {room.offer_percentage > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({room.offer_percentage}%)</span>
                          <span>-₹{((room.price - (room.final_price || room.price)) * nights).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={bookingMutation.isPending || !checkInDate || !checkOutDate}
                    >
                      {bookingMutation.isPending ? 'Processing...' : 'Confirm Booking'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By confirming, you agree to our terms and conditions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookNow;

