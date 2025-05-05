import React, { useState } from 'react';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { SearchInput } from '../ui/FormFields';
import Button from '../ui/Button';
import { Drive } from '../../api/drives';

interface Class {
  pk: number;
  name: string;
}

interface DriveListProps {
  drives: Drive[];
  classes: Class[];
  onEdit: (drive: Drive) => void;
  onDelete: (id: string) => void;
}

const DriveList: React.FC<DriveListProps> = ({
  drives,
  classes,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const drivesPerPage = 5;

  // Filter drives based on search term
  const filteredDrives = drives.filter(drive => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (drive.name?.toLowerCase() || '').includes(searchLower) ||
      (drive.class_name?.toLowerCase() || '').includes(searchLower)
    );
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination logic
  const indexOfLastDrive = currentPage * drivesPerPage;
  const indexOfFirstDrive = indexOfLastDrive - drivesPerPage;
  const currentDrives = filteredDrives.slice(indexOfFirstDrive, indexOfLastDrive);
  const totalPages = Math.ceil(filteredDrives.length / drivesPerPage);

  // Change page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by vaccine name or class..."
        />
      </div>

      {currentDrives.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentDrives.map((drive) => (
              <div
                key={drive.pk}
                className="border rounded-lg p-4 bg-white"
              >
                <div className="flex flex-wrap justify-between">
                  <div className="mb-2 md:mb-0">
                    <h3 className="font-medium text-blue-700">
                      {drive.name}
                    </h3>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(drive.drive_date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1 sm:mt-0">
                        Class: {drive.class_name}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center">
                    <div className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {drive.available_slots} slots
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(drive)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(drive.pk.toString())}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstDrive + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastDrive, filteredDrives.length)}
                </span>{" "}
                of <span className="font-medium">{filteredDrives.length}</span> drives
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {drives.length === 0
              ? "No vaccination drives found"
              : "No vaccination drives matching your search criteria"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DriveList;