import React, { useState } from 'react';

interface Class {
  pk: number;
  name: string;
}

interface StudentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  classes: Class[];
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
  const base = 'px-4 py-2 rounded font-semibold';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-100',
  };
  return (
    <button type={type} className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

// ----- StudentForm -----
const StudentForm: React.FC<StudentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  classes
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    class_id: initialData?.class_id?.toString() || '',
    student_id: initialData?.student_id || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.class_id) newErrors.class_id = 'Class is required';
    if (!formData.student_id.trim()) newErrors.student_id = 'Student ID is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Student Name"
        value={formData.name}
        onChange={handleChange}
        required
        error={errors.name}
        name="name"
      />
      <Input
        id="student_id"
        label="Student ID"
        value={formData.student_id}
        onChange={handleChange}
        required
        error={errors.student_id}
        name="student_id"
      />
      <Select
        id="class_id"
        label="Class"
        value={formData.class_id}
        onChange={handleChange}
        options={classes.map(c => ({ value: c.pk.toString(), label: c.name }))}
        required
        error={errors.class_id}
        name="class_id"
        placeholder="Select class"
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
