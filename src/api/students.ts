import apiClient from './client';

export interface Student {
  pk: number;
  name: string;
  student_id: string;
  Class_id: number;
  class_name: string;
  created_at: string;
}

export interface StudentResponse {
  status: number;
  message: string;
  data: {
    student_list: Student[];
  };
}

export const getAllStudents = async (): Promise<StudentResponse> => {
  return apiClient.get('students/all_students');
};

export const addStudent = async (data: Partial<Student>) => {
  const formData = new FormData();
  formData.append('name', data.name || '');
  formData.append('student_id', data.student_id || '');
  formData.append('class_id', data.class_id?.toString() || '');
  
  return apiClient.post('students/add_student', formData);
};

export const updateStudent = async (id: string, data: Partial<Student>) => {
  const formData = new FormData();
  formData.append('name', data.name || '');
  formData.append('student_id', data.student_id || '');
  formData.append('class_id', data.class_id?.toString() || '');
  
  return apiClient.post(`students/update_student/${id}`, formData);
};

export const deleteStudent = async (id: string) => {
  return apiClient.get(`students/delete_student/${id}`);
};

export const importStudents = async (file: File) => {
  const formData = new FormData();
  formData.append('import_file', file);
  
  return apiClient.post('students/upload', formData);
};