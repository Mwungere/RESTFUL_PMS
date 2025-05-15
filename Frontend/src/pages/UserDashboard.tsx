import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserVehicles, deleteVehicle } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import AddVehicleModal from '../components/AddVehicleModal';

export default function UserDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles', currentPage],
    queryFn: () => getUserVehicles(currentPage),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

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
        <h1 className="text-2xl font-bold">My Vehicles</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Vehicle</Button>
      </div>

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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {vehicles?.map((vehicle) => (
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
                  <Button
                    variant="danger"
                    onClick={() => deleteMutation.mutate(vehicle.id)}
                    isLoading={deleteMutation.isPending}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vehicles && vehicles.length > 10 && (
        <div className="mt-4 flex justify-center space-x-2">
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
            disabled={currentPage * 10 >= vehicles.length}
          >
            Next
          </Button>
        </div>
      )}

      <AddVehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
} 