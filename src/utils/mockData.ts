import { Student, VaccinationDrive, User } from '../types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@school.edu',
    password: 'password123',
    school: 'Springfield Elementary'
  }
];

// Mock students
export const students: Student[] = [
  { id: '1', name: 'John Doe', class: '10A', vaccinated: true, vaccineName: 'Measles', vaccinationDate: '2024-01-15' },
  { id: '2', name: 'Jane Smith', class: '10A', vaccinated: false },
  { id: '3', name: 'Emily Johnson', class: '9B', vaccinated: true, vaccineName: 'Polio', vaccinationDate: '2024-02-20' },
  { id: '4', name: 'Michael Brown', class: '9B', vaccinated: false },
  { id: '5', name: 'Sarah Williams', class: '11C', vaccinated: true, vaccineName: 'Measles', vaccinationDate: '2024-01-10' },
  { id: '6', name: 'David Miller', class: '11C', vaccinated: false },
  { id: '7', name: 'Emma Davis', class: '12D', vaccinated: true, vaccineName: 'Hepatitis B', vaccinationDate: '2024-03-05' },
  { id: '8', name: 'James Wilson', class: '12D', vaccinated: false },
  { id: '9', name: 'Olivia Taylor', class: '8E', vaccinated: true, vaccineName: 'Tetanus', vaccinationDate: '2024-02-28' },
  { id: '10', name: 'Daniel Anderson', class: '8E', vaccinated: false },
  { id: '11', name: 'Sophia Martinez', class: '7F', vaccinated: true, vaccineName: 'Chickenpox', vaccinationDate: '2024-03-15' },
  { id: '12', name: 'Ethan Thomas', class: '7F', vaccinated: false },
];

// Calculate current date for comparison
const currentDate = new Date();

// Function to check if a date is in the past
const isPastDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date < currentDate;
};

// Mock vaccination drives
export const vaccinationDrives: VaccinationDrive[] = [
  {
    id: '1',
    name: 'Measles Vaccination',
    date: '2024-01-15',
    doses: 100,
    applicableClasses: ['10A', '11C'],
    isPast: isPastDate('2024-01-15')
  },
  {
    id: '2',
    name: 'Polio Vaccination',
    date: '2024-02-20',
    doses: 150,
    applicableClasses: ['9B', '8E'],
    isPast: isPastDate('2024-02-20')
  },
  {
    id: '3',
    name: 'Hepatitis B Vaccination',
    date: '2024-03-05',
    doses: 120,
    applicableClasses: ['12D', '7F'],
    isPast: isPastDate('2024-03-05')
  },
  {
    id: '4',
    name: 'Tetanus Vaccination',
    date: '2024-12-10',
    doses: 200,
    applicableClasses: ['8E', '9B', '10A'],
    isPast: isPastDate('2024-12-10')
  },
  {
    id: '5',
    name: 'Chickenpox Vaccination',
    date: '2024-11-25',
    doses: 180,
    applicableClasses: ['7F', '11C', '12D'],
    isPast: isPastDate('2024-11-25')
  }
];

// Dashboard stats calculations
export const getStats = () => {
  const totalStudents = students.length;
  const vaccinatedStudents = students.filter(student => student.vaccinated).length;
  const vaccinationPercentage = Math.round((vaccinatedStudents / totalStudents) * 100);
  
  const upcomingDrives = vaccinationDrives.filter(drive => {
    const driveDate = new Date(drive.date);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return driveDate > currentDate && driveDate <= thirtyDaysFromNow;
  });

  return {
    totalStudents,
    vaccinatedStudents,
    vaccinationPercentage,
    upcomingDrives
  };
};

// Get vaccination classes
export const getClasses = (): string[] => {
  return [...new Set(students.map(student => student.class))].sort();
};

// Get vaccine names
export const getVaccineNames = (): string[] => {
  const vaccineNames = students
    .filter(student => student.vaccineName)
    .map(student => student.vaccineName as string);
  
  return [...new Set(vaccineNames)].sort();
};