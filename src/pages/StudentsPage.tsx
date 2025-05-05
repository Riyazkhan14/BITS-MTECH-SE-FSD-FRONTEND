import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import StudentTable from '../components/students/StudentTable';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import StudentForm from '../components/students/StudentForm';
import { getAllStudents, addStudent, updateStudent, deleteStudent, Student } from '../api/students';
import { getAllClasses } from '../api/classes';
import { UserPlus } from 'lucide-react';

interface Class {
  pk: number;
  name: string;
}

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsResponse, classesResponse] = await Promise.all([
        getAllStudents(),
        getAllClasses()
      ]);

      if (studentsResponse.status === 200) {
        setStudents(studentsResponse.data.student_list || []);
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

  const handleAddEditStudent = async (studentData: Partial<Student>) => {
    try {
      if (editingStudent) {
        const response = await updateStudent(editingStudent.pk.toString(), studentData);

        if (response.status === 200) {
          setSuccess('Student updated successfully');
          fetchData();
        }
      } else {
        const response = await addStudent(studentData);
        
        if (response.status === 200) {
          setSuccess('Student added successfully');
          fetchData();
        }
      }

      setEditingStudent(null);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save student');
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    try {
      const response = await deleteStudent(studentToDelete.student_id);
      
      if (response.status === 200) {
        setSuccess('Student deleted successfully');
        fetchData();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
    } finally {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">
            Add, edit, and manage student records
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => {
            setEditingStudent(null);
            setIsModalOpen(true);
          }}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
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
        <StudentTable
          students={students}
          classes={classes}
          onEdit={handleEditStudent}
          onDelete={handleDeleteClick}
        />
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <StudentForm
          onSubmit={handleAddEditStudent}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingStudent(null);
          }}
          initialData={editingStudent}
          classes={classes}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Student"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this student? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
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

export default StudentsPage;