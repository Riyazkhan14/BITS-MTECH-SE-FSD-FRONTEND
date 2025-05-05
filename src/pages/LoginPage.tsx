import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Syringe, AlertCircle } from 'lucide-react';
import { Input } from '../components/ui/FormFields';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-3">
              <Syringe className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">School Vaccination Portal</h1>
          <p className="mt-2 text-blue-100">
            Manage vaccination records for your students
          </p>
        </div>
        
        <div className="p-6 sm:p-8">
          {error && (
            <Alert
              variant="error"
              message={error}
              onClose={() => setError('')}
              className="mb-4"
            />
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@gmail.com"
              name="email"
              disabled={isSubmitting}
            />
            
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              name="password"
              disabled={isSubmitting}
            />
            
            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login to Dashboard'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 flex items-center py-2 px-3 bg-blue-50 rounded-md text-xs text-blue-700">
            <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
            <p>
              Demo credentials: <strong>admin@gmail.com</strong> / <strong>123456</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage