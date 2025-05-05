import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import VaccinationList from '../components/vaccinations/VaccinationList';
import VaccinationForm from '../components/vaccinations/VaccinationForm';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { getVaccinationRecords, addVaccination, VaccinationRecord } from '../api/vaccinations';
import { getAllStudents, Student } from '../api/students';
import { getAllDrives, Drive } from '../api/drives';
import { PlusCircle } from 'lucide-react';

const VaccinationsPage: React.FC = () => {
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vaccinationsRes, studentsRes, drivesRes] = await Promise.all([
        getVaccinationRecords(),
        getAllStudents(),
        getAllDrives()
      ]);

      if (vaccinationsRes.status === 200) {
        setVaccinations(vaccinationsRes.data.vaccine_data || []);
      }

      if (studentsRes.status === 200) {
        setStudents(studentsRes.data.student_list || []);
      }

      if (drivesRes.status === 200) {
        setDrives(drivesRes.data.drive_list || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVaccination = async (data: {
    student_id: number;
    vaccine_id: number;
    vaccination_date: string;
  }) => {
    try {
      const response = await addVaccination(data);
      
      if (response.status === 200) {
        setSuccess('Vaccination record added successfully');
        fetchData();
        setIsModalOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add vaccination record');
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
          <h1 className="text-2xl font-bold text-gray-900">Vaccination Records</h1>
          <p className="text-gray-600 mt-1">
            Manage student vaccination records
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Vaccination Record
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
        <VaccinationList vaccinations={vaccinations} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Vaccination Record"
      >
        <VaccinationForm
          onSubmit={handleAddVaccination}
          onCancel={() => setIsModalOpen(false)}
          students={students}
          drives={drives}
        />
      </Modal>
    </PageLayout>
  );
};

export default VaccinationsPage;