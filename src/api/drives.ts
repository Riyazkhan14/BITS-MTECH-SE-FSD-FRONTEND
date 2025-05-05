import apiClient from './client';

export interface Drive {
  pk: number;
  name: string;
  Class_id: number;
  class_name: string;
  drive_date: string;
  available_slots: number;
  created_at: string;
}

export interface DriveResponse {
  status: number;
  message: string;
  data: {
    drive_list: Drive[];
  };
}

export const getAllDrives = async (): Promise<DriveResponse> => {
  return apiClient.get('drives/all');
};

export const addDrive = async (data: Partial<Drive>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });
  
  return apiClient.post('drives/add', formData);
};

export const updateDrive = async (id: string, data: Partial<Drive>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });
  
  return apiClient.post(`drives/update/${id}`, formData);
};

export const deleteDrive = async (id: string) => {
  return apiClient.get(`drives/delete/${id}`);
};