import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import DriveList from '../components/drives/DriveList';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import DriveModalForm from '../components/drives/DriveModalForm';
import { getAllDrives, addDrive, updateDrive, deleteDrive, Drive } from '../api/drives';
import { getAllClasses } from '../api/classes';
import { Calendar } from 'lucide-react';

interface Class {
  pk: number;
  name: string;
}

const DrivesPage: React.FC = () => {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [editingDrive, setEditingDrive] = useState<Drive | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [driveToDelete, setDriveToDelete] = useState<Drive | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [drivesResponse, classesResponse] = await Promise.all([
        getAllDrives(),
        getAllClasses()
      ]);

      if (drivesResponse.status === 200) {
        setDrives(drivesResponse.data.drive_list || []);
      }

      if (classesResponse.status === 200) {
        setClasses(classesResponse.data.all_classes || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDrive = async (driveData: Partial<Drive>) => {
    try {
      const response = await addDrive(driveData);
      
      if (response.status === 200) {
        setSuccess('Drive added successfully');
        fetchData();
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add drive');
    }
  };

  const handleEditDrive = async (driveData: Partial<Drive>) => {
    if (!editingDrive) return;

    try {
      const response = await updateDrive(editingDrive.pk.toString(), driveData);

      if (response.status === 200) {
        setSuccess('Drive updated successfully');
        fetchData();
        setIsEditModalOpen(false);
        setEditingDrive(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update drive');
    }
  };

  const handleDeleteClick = (drive: Drive) => {
    setDriveToDelete(drive);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!driveToDelete) return;

    try {
      const response = await deleteDrive(driveToDelete.pk.toString());
      
      if (response.status === 200) {
        setSuccess('Drive deleted successfully');
        fetchData();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete drive');
    } finally {
      setIsDeleteModalOpen(false);
      setDriveToDelete(null);
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vaccination Drives</h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage vaccination drives
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Drive
        </Button>
      </div>

      {error && (
        <Alert
          variant="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {success && (
        <Alert
          variant="success"
          message={success}
          onClose={() => setSuccess(null)}
          className="mb-6"
        />
      )}

      <Card>
        <DriveList
          drives={drives}
          classes={classes}
          onEdit={(drive) => {
            setEditingDrive(drive);
            setIsEditModalOpen(true);
          }}
          onDelete={handleDeleteClick}
        />
      </Card>

      {/* Add Drive Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Vaccination Drive"
      >
        <DriveModalForm
          onSubmit={handleAddDrive}
          onCancel={() => setIsAddModalOpen(false)}
          classes={classes}
        />
      </Modal>

      {/* Edit Drive Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingDrive(null);
        }}
        title="Edit Vaccination Drive"
      >
        <DriveModalForm
          onSubmit={handleEditDrive}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingDrive(null);
          }}
          initialData={editingDrive}
          classes={classes}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Vaccination Drive"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this vaccination drive? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default DrivesPage;