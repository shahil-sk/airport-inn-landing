import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { BedDouble, Edit, Trash2, Plus, Power } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const AdminRooms = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: () => adminApi.getRooms(),
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: ({ roomId, isAvailable }: { roomId: number; isAvailable: boolean }) =>
      adminApi.updateRoomAvailability(roomId, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: 'Success',
        description: 'Room availability updated',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (roomId: number) => adminApi.deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: 'Success',
        description: 'Room deleted successfully',
      });
    },
  });

  const rooms = (data?.data as any[]) || [];

  const handleToggleAvailability = (room: any) => {
    updateAvailabilityMutation.mutate({
      roomId: room.room_id,
      isAvailable: !room.is_available,
    });
  };

  const handleDelete = (roomId: number) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      deleteMutation.mutate(roomId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rooms Management</h1>
          <p className="text-muted-foreground">Manage all rooms and their availability</p>
        </div>
        <Button asChild>
          <Link to="/admin/rooms/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Room
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Rooms ({rooms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No rooms found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room: any) => (
                <div
                  key={room.room_id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BedDouble className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{room.title}</p>
                        <p className="text-sm text-muted-foreground">{room.room_number}</p>
                        <p className="text-xs text-muted-foreground">{room.category_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-semibold">₹{room.final_price || room.price}/night</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Availability:</span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={room.is_available}
                          onCheckedChange={() => handleToggleAvailability(room)}
                          disabled={updateAvailabilityMutation.isPending}
                        />
                        <Badge
                          variant={room.is_available ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {room.is_available ? 'Available' : 'Booked/Unavailable'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={room.is_enabled ? 'default' : 'secondary'}>
                        {room.is_enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/admin/rooms/${room.room_id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(room.room_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRooms;

