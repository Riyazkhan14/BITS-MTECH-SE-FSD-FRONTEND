import apiClient from './client';

export interface VaccinationRecord {
  pk: number;
  student_name: string;
  student_id: string;
  class_name: string;
  vaccine_name: string;
  is_vaccinated: boolean;
  vaccine_date: string;
}

export interface VaccinationResponse {
  status: number;
  message: string;
  data: {
    vaccine_data: VaccinationRecord[];
  };
}

export const getVaccinationRecords = async (): Promise<VaccinationResponse> => {
  return apiClient.get('drives/student_vaccine_data');
};

export const addVaccination = async (data: {
  student_id: number;
  vaccine_id: number;
  vaccination_date: string;
}) => {
  const formData = new FormData();
  formData.append('student_id', data.student_id.toString());
  formData.append('vaccine_id', data.vaccine_id.toString());
  formData.append('vaccination_date', data.vaccination_date);
  
  return apiClient.post('drives/add_student_vaccine', formData);
};