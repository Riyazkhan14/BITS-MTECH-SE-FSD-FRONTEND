import apiClient from './client';

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    message: string;
    token: string;
    email: string;
    name: string;
    mobile_no: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('password', data.password);
  
  return apiClient.post('accounts/login', formData);
};

export interface RegisterData {
  name: string;
  email: string;
  mobile_no: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  return apiClient.post('accounts/register', formData);
};