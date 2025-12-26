import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, AlertCircle } from 'lucide-react';

const AdminInventory = () => {
  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: () => adminApi.getRooms(),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.getCategories(),
  });

  const rooms = roomsData?.data || [];
  const categories = categoriesData?.data || [];

  const getCategoryStats = () => {
    return categories.map((cat: any) => {
      const categoryRooms = rooms.filter((r: any) => r.category_id === cat.category_id);
      const availableRooms = categoryRooms.filter((r: any) => r.is_available && r.is_enabled);
      const bookedRooms = categoryRooms.filter((r: any) => !r.is_available && r.is_enabled);
      const disabledRooms = categoryRooms.filter((r: any) => !r.is_enabled);

      return {
        ...cat,
        total: categoryRooms.length,
        available: availableRooms.length,
        booked: bookedRooms.length,
        disabled: disabledRooms.length,
      };
    });
  };

  const categoryStats = getCategoryStats();
  const totalRooms = rooms.length;
  const totalAvailable = rooms.filter((r: any) => r.is_available && r.is_enabled).length;
  const totalBooked = rooms.filter((r: any) => !r.is_available && r.is_enabled).length;
  const totalDisabled = rooms.filter((r: any) => !r.is_enabled).length;

  if (roomsLoading || categoriesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">Room inventory and availability overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAvailable}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Booked</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalBooked}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disabled</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalDisabled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map((stat: any) => {
              const utilizationRate = stat.total > 0 ? ((stat.booked / stat.total) * 100).toFixed(0) : 0;
              return (
                <div key={stat.category_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{stat.name}</h3>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{utilizationRate}%</p>
                      <p className="text-xs text-muted-foreground">Utilization</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold">{stat.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="text-lg font-semibold text-green-600">{stat.available}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Booked</p>
                      <p className="text-lg font-semibold text-yellow-600">{stat.booked}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Disabled</p>
                      <p className="text-lg font-semibold text-red-600">{stat.disabled}</p>
                    </div>
                  </div>

                  <div className="mt-4 w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full transition-all"
                      style={{ width: `${utilizationRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventory;

