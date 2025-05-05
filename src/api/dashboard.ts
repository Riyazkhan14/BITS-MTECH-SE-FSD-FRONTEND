import apiClient from './client';

export interface DashboardStats {
  total_student: number;
  ttl_data_count: number;
  drives: number;
  month_count: number;
  percent_no: number;
}

export interface DashboardResponse {
  status: number;
  message: string;
  data: DashboardStats;
}

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  return apiClient.get('drives/count_api');
};