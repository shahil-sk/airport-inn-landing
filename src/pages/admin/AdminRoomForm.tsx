import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, roomsApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AdminRoomForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    room_number: '',
    title: '',
    category_id: '',
    short_tagline: '',
    long_description: '',
    price: '',
    offer_percentage: '0',
    is_available: true,
    is_enabled: true,
    facilities: [] as string[],
  });

  const [facilityInput, setFacilityInput] = useState('');

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.getCategories(),
  });

  // Fetch room if editing
  const { data: roomData, isLoading: roomLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: () => roomsApi.getById(Number(id!)),
    enabled: isEdit && !!id,
  });

  // Load room data if editing
  useEffect(() => {
    if (roomData?.data && isEdit) {
      const room = roomData.data;
      setFormData({
        room_number: room.room_number || '',
        title: room.title || '',
        category_id: String(room.category_id) || '',
        short_tagline: room.short_tagline || '',
        long_description: room.long_description || '',
        price: String(room.price) || '',
        offer_percentage: String(room.offer_percentage || 0),
        is_available: room.is_available ?? true,
        is_enabled: room.is_enabled ?? true,
        facilities: room.facilities || [],
      });
    }
  }, [roomData, isEdit]);

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createRoom(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: 'Success',
        description: 'Room created successfully',
      });
      navigate('/admin/rooms');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create room',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateRoom(Number(id!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', id] });
      toast({
        title: 'Success',
        description: 'Room updated successfully',
      });
      navigate('/admin/rooms');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update room',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const roomData = {
      room_number: formData.room_number,
      title: formData.title,
      category_id: parseInt(formData.category_id),
      short_tagline: formData.short_tagline,
      long_description: formData.long_description,
      price: parseFloat(formData.price),
      offer_percentage: parseFloat(formData.offer_percentage),
      is_available: formData.is_available,
      is_enabled: formData.is_enabled,
      facilities: formData.facilities.map(f => ({ name: f })),
    };

    if (isEdit) {
      updateMutation.mutate(roomData);
    } else {
      createMutation.mutate(roomData);
    }
  };

  const addFacility = () => {
    if (facilityInput.trim() && !formData.facilities.includes(facilityInput.trim())) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput.trim()],
      });
      setFacilityInput('');
    }
  };

  const removeFacility = (facility: string) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter(f => f !== facility),
    });
  };

  const categories = categoriesData?.data || [];

  if (roomLoading && isEdit) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/rooms')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit Room' : 'Create New Room'}</h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update room information' : 'Add a new room to the system'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Room details and identification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="room_number">Room Number *</Label>
                    <Input
                      id="room_number"
                      required
                      value={formData.room_number}
                      onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                      placeholder="S101"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category_id">Category *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat: any) => (
                          <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Room Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Royal Suite"
                  />
                </div>

                <div>
                  <Label htmlFor="short_tagline">Short Tagline</Label>
                  <Input
                    id="short_tagline"
                    value={formData.short_tagline}
                    onChange={(e) => setFormData({ ...formData, short_tagline: e.target.value })}
                    placeholder="Couple Friendly | 24x7 WiFi | Food Facility"
                  />
                </div>

                <div>
                  <Label htmlFor="long_description">Description</Label>
                  <Textarea
                    id="long_description"
                    value={formData.long_description}
                    onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                    placeholder="Detailed room description..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set room pricing and discounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price per Night (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="5999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="offer_percentage">Discount Percentage (%)</Label>
                    <Input
                      id="offer_percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.offer_percentage}
                      onChange={(e) => setFormData({ ...formData, offer_percentage: e.target.value })}
                      placeholder="20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Facilities</CardTitle>
                <CardDescription>Add room amenities and facilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                    placeholder="Add facility (e.g., WiFi, TV, AC)"
                  />
                  <Button type="button" onClick={addFacility}>
                    Add
                  </Button>
                </div>

                {formData.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-md"
                      >
                        <span className="text-sm">{facility}</span>
                        <button
                          type="button"
                          onClick={() => removeFacility(facility)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_available">Available</Label>
                    <p className="text-sm text-muted-foreground">Room is available for booking</p>
                  </div>
                  <Switch
                    id="is_available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_enabled">Enabled</Label>
                    <p className="text-sm text-muted-foreground">Room is visible to users</p>
                  </div>
                  <Switch
                    id="is_enabled"
                    checked={formData.is_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? 'Update Room' : 'Create Room'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminRoomForm;

