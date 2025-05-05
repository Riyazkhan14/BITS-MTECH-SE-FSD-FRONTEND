import React from 'react';
import Card from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 border-blue-200',
    green: 'text-green-600 bg-green-100 border-green-200',
    purple: 'text-purple-600 bg-purple-100 border-purple-200',
    orange: 'text-orange-600 bg-orange-100 border-orange-200'
  };

  return (
    <Card className="hover-scale card-shadow">
      <div className="flex items-center">
        <div className={`p-4 rounded-xl ${colorClasses[color]} border`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="ml-2 text-sm text-gray-600">{description}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;