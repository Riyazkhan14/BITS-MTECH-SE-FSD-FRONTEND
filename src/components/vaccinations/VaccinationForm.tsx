import React, { useState } from 'react';

interface Student {
  pk: number;
  name: string;
  student_id: string;
}

interface Drive {
  pk: number;
  name: string;
}

interface VaccinationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  students: Student[];
  drives: Drive[];
}

// ----- Input Component -----
const Input = ({
  id,
  label,
  value,
  onChange,
  error,
  name,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="font-medium">
      {label}
    </label>
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      {...props}
      className={`p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

// ----- Select Component -----
const Select = ({
  id,
  label,
  value,
  onChange,
  options,
  error,
  name,
  placeholder,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  name: string;
  placeholder?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="font-medium">
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      {...props}
      className={`p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
    >
      <option value="" disabled>
        {placeholder || 'Select an option'}
      </option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

// ----- Button Component -----
const Button = ({
  type,
  variant = 'primary',
  children,
  ...props
}: {
  type: 'button' | 'submit';
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const base = 'px-4 py-2 rounded font-semibold transition-colors duration-200';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-50',
  };
  return (
    <button type={type} className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  onSubmit,
  onCancel,
  students,
  drives
}) => {
  const [formData, setFormData] = useState({
    student_id: '',
    vaccine_id: '',
    vaccination_date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.student_id) {
      newErrors.student_id = 'Student is required';
    }

    if (!formData.vaccine_id) {
      newErrors.vaccine_id = 'Vaccine is required';
    }

    if (!formData.vaccination_date) {
      newErrors.vaccination_date = 'Vaccination date is required';
    } else {
      const selectedDate = new Date(formData.vaccination_date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.vaccination_date = 'Vaccination date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        student_id: parseInt(formData.student_id),
        vaccine_id: parseInt(formData.vaccine_id),
        vaccination_date: formData.vaccination_date
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        id="student_id"
        label="Student"
        value={formData.student_id}
        onChange={handleChange}
        options={students.map(student => ({
          value: student.pk.toString(),
          label: `${student.name} (${student.student_id}) - ${student.class_name || 'No Class'}`
        }))}
        required
        error={errors.student_id}
        name="student_id"
        placeholder="Select a student"
      />

      <Select
        id="vaccine_id"
        label="Vaccine"
        value={formData.vaccine_id}
        onChange={handleChange}
        options={drives.map(drive => ({
          value: drive.pk.toString(),
          label: `${drive.name} - ${drive.drive_date}`
        }))}
        required
        error={errors.vaccine_id}
        name="vaccine_id"
        placeholder="Select a vaccine"
      />

      <Input
        id="vaccination_date"
        label="Vaccination Date"
        type="date"
        value={formData.vaccination_date}
        onChange={handleChange}
        required
        error={errors.vaccination_date}
        name="vaccination_date"
        max={new Date().toISOString().split('T')[0]}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Add Vaccination Record
        </Button>
      </div>
    </form>
  );
};

export default VaccinationForm;