import React from 'react';
import { Select, Input } from '../ui/FormFields';
import Button from '../ui/Button';

interface FilterOption {
  value: string;
  label: string;
}

interface ReportFiltersProps {
  filters: {
    vaccine: string;
    class: string;
    startDate: string;
    endDate: string;
  };
  options: {
    vaccines: FilterOption[];
    classes: FilterOption[];
  };
  onFilterChange: (name: string, value: string) => void;
  onReset: () => void;
  onGenerateReport: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  options,
  onFilterChange,
  onReset,
  onGenerateReport
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Report Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select
          id="vaccine"
          label="Vaccine"
          value={filters.vaccine}
          onChange={handleChange}
          options={[{ value: '', label: 'All Vaccines' }, ...options.vaccines]}
          name="vaccine"
        />
        
        <Select
          id="class"
          label="Class"
          value={filters.class}
          onChange={handleChange}
          options={[{ value: '', label: 'All Classes' }, ...options.classes]}
          name="class"
        />
        
        <Input
          id="startDate"
          label="Start Date"
          type="date"
          value={filters.startDate}
          onChange={handleChange}
          name="startDate"
        />
        
        <Input
          id="endDate"
          label="End Date"
          type="date"
          value={filters.endDate}
          onChange={handleChange}
          name="endDate"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onReset} size="sm">
          Reset Filters
        </Button>
        <Button variant="primary" onClick={onGenerateReport} size="sm">
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default ReportFilters;