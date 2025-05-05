import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Calendar, BarChart, LogOut, Syringe, BedDouble as Needle } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { path: '/students', label: 'Student Management', icon: <Users className="mr-3 h-5 w-5" /> },
    { path: '/drives', label: 'Vaccination Drives', icon: <Calendar className="mr-3 h-5 w-5" /> },
    { path: '/vaccinations', label: 'Vaccination Records', icon: <Needle className="mr-3 h-5 w-5" /> },
    { path: '/reports', label: 'Reports', icon: <BarChart className="mr-3 h-5 w-5" /> },
  ];

  return (
    <div className="h-full bg-gradient-to-b from-blue-700 to-blue-800 text-white w-64 flex flex-col shadow-xl">
      <div className="p-6 border-b border-blue-600">
        <div className="flex items-center">
          <div className="p-2 bg-white/10 rounded-lg">
            <Syringe className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold ml-3">Vax Portal</h1>
        </div>
      </div>
      
      <nav className="flex-1 pt-6 pb-4 overflow-y-auto">
        <ul className="space-y-1.5 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200
                  ${location.pathname === item.path 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-blue-100 hover:bg-white/5'}
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-600">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2.5 text-sm text-blue-100 rounded-lg hover:bg-white/5 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;