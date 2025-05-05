import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

interface QuickAccessTileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const QuickAccessTile: React.FC<QuickAccessTileProps> = ({
  title,
  description,
  icon,
  to,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'hover:bg-blue-50 hover:border-blue-200 group-hover:text-blue-600',
    green: 'hover:bg-green-50 hover:border-green-200 group-hover:text-green-600',
    purple: 'hover:bg-purple-50 hover:border-purple-200 group-hover:text-purple-600',
    orange: 'hover:bg-orange-50 hover:border-orange-200 group-hover:text-orange-600'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };

  return (
    <Link to={to} className="group">
      <Card className={`h-full transition-all duration-200 border hover-scale card-shadow ${colorClasses[color]}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-lg ${iconColorClasses[color]} bg-opacity-10`}>
              {icon}
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900 group-hover:text-gray-700">
              {title}
            </h3>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </Card>
    </Link>
  );
};

export default QuickAccessTile;