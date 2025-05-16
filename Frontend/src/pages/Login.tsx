import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to login');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md space-y-5">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="rounded-t-md"
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="rounded-b-md"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={loginMutation.isPending}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 