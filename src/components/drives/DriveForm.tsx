import React, { useState } from 'react';
import { Input, Select } from '../ui/FormFields';
import Button from '../ui/Button';

interface Class {
  pk: number;
  name: string;
}

interface DriveFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  classes: Class[];
}

const DriveForm: React.FC<DriveFormProps> = ({
  onSubmit,
  initialData,
  classes
}) => {
  const [formData, setFormData] = useState({
    vaccine_name: initialData?.vaccine_name || '',
    class_id: initialData?.class_id || '',
    drive_date: initialData?.drive_date || '',
    available_slots: initialData?.available_slots?.toString() || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vaccine_name.trim()) {
      newErrors.vaccine_name = 'Vaccine name is required';
    }

    if (!formData.drive_date) {
      newErrors.drive_date = 'Drive date is required';
    } else {
      const selectedDate = new Date(formData.drive_date);
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 15);

      if (selectedDate < today) {
        newErrors.drive_date = 'Drive date cannot be in the past';
      } else if (selectedDate < futureDate) {
        newErrors.drive_date = 'Drive date must be at least 15 days in the future';
      }
    }

    if (!formData.available_slots) {
      newErrors.available_slots = 'Number of slots is required';
    } else if (parseInt(formData.available_slots) <= 0) {
      newErrors.available_slots = 'Number of slots must be greater than zero';
    }

    if (!formData.class_id) {
      newErrors.class_id = 'Class is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        ...formData,
        available_slots: parseInt(formData.available_slots)
      };

      onSubmit(submitData);

      // Reset form if adding new drive (no initialData)
      if (!initialData) {
        setFormData({
          vaccine_name: '',
          class_id: '',
          drive_date: '',
          available_slots: ''
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="vaccine_name"
          label="Vaccine Name"
          value={formData.vaccine_name}
          onChange={handleChange}
          required
          error={errors.vaccine_name}
          name="vaccine_name"
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

        <Input
          id="drive_date"
          label="Drive Date"
          type="date"
          value={formData.drive_date}
          onChange={handleChange}
          required
          error={errors.drive_date}
          name="drive_date"
        />

        <Input
          id="available_slots"
          label="Available Slots"
          type="number"
          value={formData.available_slots}
          onChange={handleChange}
          required
          error={errors.available_slots}
          name="available_slots"
          min="1"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          {initialData ? 'Update Drive' : 'Schedule Drive'}
        </Button>
      </div>
    </form>
  );
};

export default DriveForm;