import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

interface BulkUploadSectionProps {
  onUpload: (data: any[]) => void;
}

const BulkUploadSection: React.FC<BulkUploadSectionProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      handleFile(uploadedFile);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      handleFile(uploadedFile);
    }
  };
  
  const handleFile = (uploadedFile: File) => {
    setError(null);
    setSuccess(null);
    
    // Check file type (should be CSV)
    if (!uploadedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setFile(null);
      return;
    }
    
    setFile(uploadedFile);
  };
  
  const processFile = () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = content.split('\n');
        
        // Expect header row: Name,Class,ID,Vaccinated,VaccineName,VaccinationDate
        const header = rows[0].split(',');
        
        if (header.length < 4) {
          throw new Error('CSV file must have at least the following columns: Name, Class, ID, Vaccinated');
        }
        
        const students = [];
        
        // Start from index 1 to skip header
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty rows
          
          const values = rows[i].split(',');
          
          if (values.length >= 4) {
            students.push({
              name: values[0].trim(),
              class: values[1].trim(),
              id: values[2].trim() || `TEMP-${i}`,
              vaccinated: values[3].trim().toLowerCase() === 'true',
              vaccineName: values[4]?.trim() || '',
              vaccinationDate: values[5]?.trim() || ''
            });
          }
        }
        
        if (students.length === 0) {
          throw new Error('No valid student records found in the CSV file');
        }
        
        onUpload(students);
        setSuccess(`Successfully processed ${students.length} student records`);
        setFile(null);
        
        // Reset the file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } catch (err: any) {
        setError(err.message || 'Failed to process CSV file');
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="space-y-4">
      {error && (
        <Alert 
          variant="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
      
      {success && (
        <Alert 
          variant="success" 
          message={success} 
          onClose={() => setSuccess(null)} 
        />
      )}
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-700">
          Drag and drop your CSV file here, or
        </p>
        <label
          htmlFor="file-upload"
          className="mt-2 inline-block cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-blue-600 shadow-sm hover:bg-gray-50"
        >
          Browse files
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept=".csv"
            onChange={handleFileInput}
          />
        </label>
        
        <p className="mt-2 text-xs text-gray-500">
          CSV file must have columns: Name, Class, ID, Vaccinated, VaccineName (optional), VaccinationDate (optional)
        </p>
      </div>
      
      {file && (
        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
          <div>
            <p className="text-sm font-medium text-blue-800">{file.name}</p>
            <p className="text-xs text-blue-600">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
          <Button onClick={processFile} variant="primary" size="sm">
            Process File
          </Button>
        </div>
      )}
    </div>
  );
};

export default BulkUploadSection;