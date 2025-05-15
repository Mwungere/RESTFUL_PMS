import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllVehicles, updateVehicleStatus } from '../services/api';
import { Button } from '../components/Button';

type Status = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
const STATUS_OPTIONS: Status[] = ['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'];

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<Status>('ALL');
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['admin-vehicles', currentPage, selectedStatus],
    queryFn: () => {
      const status = selectedStatus === 'ALL' ? undefined : selectedStatus;
      console.log('Fetching vehicles with status:', status); // Debug log
      return getAllVehicles(currentPage, 10, status);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'REJECTED' }) =>
      updateVehicleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
    },
  });

  const handleStatusChange = (status: Status) => {
    console.log('Status changed to:', status); // Debug log
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when changing status
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Vehicles</h1>
        <div className="flex space-x-2">
          {STATUS_OPTIONS.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'primary' : 'secondary'}
              onClick={() => handleStatusChange(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {vehicles && vehicles.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  License Plate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Parking Slot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="whitespace-nowrap px-6 py-4">{vehicle.plateNumber}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        vehicle.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : vehicle.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {vehicle.slotNumber || '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {vehicle.owner ? `${vehicle.owner.firstName} ${vehicle.owner.lastName}` : '-'}
                    <br />
                    <span className="text-sm text-gray-500">{vehicle.owner?.email}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {vehicle.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="success"
                          onClick={() =>
                            statusMutation.mutate({ id: vehicle.id, status: 'ACCEPTED' })
                          }
                          isLoading={statusMutation.isPending}
                          disabled={statusMutation.isPending}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() =>
                            statusMutation.mutate({ id: vehicle.id, status: 'REJECTED' })
                          }
                          isLoading={statusMutation.isPending}
                          disabled={statusMutation.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center space-x-2 pb-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={vehicles.length < 10}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border bg-gray-50">
          <p className="text-center text-gray-500">
            {selectedStatus === 'ALL'
              ? 'No vehicles found'
              : `No ${selectedStatus.toLowerCase()} vehicles found`}
          </p>
        </div>
      )}
    </div>
  );
} 