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

export interface VaccinationReportResponse {
  status: number;
  message: string;
  data: {
    vaccine_data: VaccinationRecord[];
  };
}

export const getVaccinationReport = async (): Promise<VaccinationReportResponse> => {
  return apiClient.get('drives/student_vaccine_data');
};