import apiClient from './client';

export interface Class {
  pk: number;
  name: string;
  created_at: string;
}

export const getAllClasses = async () => {
  return apiClient.get('class_app/all');
};