import React from 'react';
import { Calendar } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { VaccinationDrive } from '../../types';

interface UpcomingDrivesProps {
  drives: VaccinationDrive[];
}

const UpcomingDrives: React.FC<UpcomingDrivesProps> = ({ drives }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Upcoming Vaccination Drives
        </CardTitle>
      </CardHeader>
      <CardContent>
        {drives.length > 0 ? (
          <ul className="space-y-4">
            {drives.map((drive) => (
              <li key={drive.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{drive.name}</h4>
                    <p className="text-sm text-gray-600">
                      Classes: {drive.applicableClasses.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{formatDate(drive.date)}</p>
                    <p className="text-sm text-gray-600">{drive.doses} doses</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming drives in the next 30 days</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDrives;