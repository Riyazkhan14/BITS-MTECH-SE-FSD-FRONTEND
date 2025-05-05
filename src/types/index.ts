export interface Student {
  id: string;
  name: string;
  class: string;
  vaccinated: boolean;
  vaccineName?: string;
  vaccinationDate?: string;
}

export interface VaccinationDrive {
  id: string;
  name: string;
  date: string;
  doses: number;
  applicableClasses: string[];
  isPast: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  school: string;
}