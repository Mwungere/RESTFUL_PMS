import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Parking Management System
            </h1>
            <span className="text-sm text-gray-500">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">
              {user?.role === 'ADMIN' ? 'Admin' : 'Client'}
            </span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 