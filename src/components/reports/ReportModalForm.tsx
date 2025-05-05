import React, { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface ReportModalFormProps {
  initialData: {
    vaccine: string;
    class: string;
    startDate: string;
    endDate: string;
  };
  options: {
    vaccines: FilterOption[];
    classes: FilterOption[];
  };
  onSubmit: (data: any) => void;
  onReset: () => void;
  onCancel: () => void;
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
  options: FilterOption[];
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
      <option value="">{placeholder || 'All'}</option>
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
  onClick,
  ...props
}: {
  type: 'button' | 'submit';
  variant?: 'primary' | 'outline' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const base = 'px-4 py-2 rounded font-semibold transition-colors duration-200';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-50',
  };
  return (
    <button 
      type={type} 
      className={`${base} ${variants[variant]}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const ReportModalForm: React.FC<ReportModalFormProps> = ({
  initialData,
  options,
  onSubmit,
  onReset,
  onCancel
}) => {
  const [formData, setFormData] = useState(initialData);
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

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        id="vaccine"
        label="Vaccine"
        value={formData.vaccine}
        onChange={handleChange}
        options={options.vaccines}
        name="vaccine"
        placeholder="All Vaccines"
      />

      <Select
        id="class"
        label="Class"
        value={formData.class}
        onChange={handleChange}
        options={options.classes}
        name="class"
        placeholder="All Classes"
      />

      <Input
        id="startDate"
        label="Start Date"
        type="date"
        value={formData.startDate}
        onChange={handleChange}
        name="startDate"
      />

      <Input
        id="endDate"
        label="End Date"
        type="date"
        value={formData.endDate}
        onChange={handleChange}
        error={errors.endDate}
        name="endDate"
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="secondary" onClick={onReset}>
          Reset Filters
        </Button>
        <Button type="submit" variant="primary">
          Apply Filters
        </Button>
      </div>
    </form>
  );
};

export default ReportModalForm;