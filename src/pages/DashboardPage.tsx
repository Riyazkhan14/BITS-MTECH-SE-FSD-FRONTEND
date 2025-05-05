import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import StatsCard from '../components/dashboard/StatsCard';
import QuickAccessTile from '../components/dashboard/QuickAccessTile';
import VaccinationChart from '../components/dashboard/VaccinationChart';
import { Users, Syringe, Calendar, BarChart, Percent } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, DashboardStats } from '../api/dashboard';
import Alert from '../components/ui/Alert';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      if (response.status === 200) {
        setStats(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, <span className="text-blue-600 font-medium">{user?.name || 'Administrator'}</span>! 
          Here's what's happening at your school.
        </p>
      </div>

      {error && (
        <Alert
          variant="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      
      {/* Stats Cards */}
      <div className="stats-grid mb-8">
        <div className="animate-fade-in-delay-1">
          <StatsCard
            title="Total Students"
            value={stats?.total_student || 0}
            icon={<Users className="h-7 w-7" />}
            color="blue"
          />
        </div>
        
        <div className="animate-fade-in-delay-2">
          <StatsCard
            title="Total Vaccinations"
            value={stats?.ttl_data_count || 0}
            icon={<Syringe className="h-7 w-7" />}
            color="green"
          />
        </div>
        
        <div className="animate-fade-in-delay-3">
          <StatsCard
            title="Active Drives"
            value={stats?.drives || 0}
            icon={<Calendar className="h-7 w-7" />}
            color="purple"
          />
        </div>

        <div className="animate-fade-in-delay-3">
          <StatsCard
            title="Unvaccinated Rate"
            value={`${stats?.percent_no || 0}%`}
            icon={<Percent className="h-7 w-7" />}
            color="orange"
            description="of total students"
          />
        </div>
      </div>
      
      {/* Vaccination Chart */}
      <div className="mb-8 animate-fade-in-delay-2">
        <VaccinationChart 
          totalStudents={stats?.total_student || 0}
          vaccinatedStudents={(stats?.total_student || 0) - Math.round(((stats?.percent_no || 0) / 100) * (stats?.total_student || 0))}
        />
      </div>
      
      {/* Quick Access Tiles */}
      <div className="animate-fade-in-delay-3">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAccessTile
            title="Manage Students"
            description="Add, edit or remove student records and vaccination status"
            icon={<Users className="h-6 w-6" />}
            to="/students"
            color="blue"
          />
          
          <QuickAccessTile
            title="Manage Drives"
            description="Schedule and organize vaccination drives for your school"
            icon={<Calendar className="h-6 w-6" />}
            to="/drives"
            color="green"
          />
          
          <QuickAccessTile
            title="Generate Reports"
            description="Create customized reports with filters for different needs"
            icon={<BarChart className="h-6 w-6" />}
            to="/reports"
            color="purple"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;