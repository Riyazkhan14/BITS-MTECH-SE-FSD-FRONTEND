import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import ReportTable from '../components/reports/ReportTable';
import ReportModalForm from '../components/reports/ReportModalForm';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { getVaccinationReport, VaccinationRecord } from '../api/reports';
import { Filter } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<VaccinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    vaccine: '',
    class: '',
    startDate: '',
    endDate: ''
  });
  
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await getVaccinationReport();
      if (response.status === 200) {
        setRecords(response.data.vaccine_data);
        setFilteredRecords(response.data.vaccine_data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSubmit = (filterData: typeof filters) => {
    let filtered = [...records];
    
    if (filterData.vaccine) {
      filtered = filtered.filter(record => 
        record.vaccine_name === filterData.vaccine
      );
    }
    
    if (filterData.class) {
      filtered = filtered.filter(record => 
        record.class_name === filterData.class
      );
    }
    
    if (filterData.startDate || filterData.endDate) {
      filtered = filtered.filter(record => {
        const vaccineDate = new Date(record.vaccine_date);
        
        if (filterData.startDate) {
          const startDate = new Date(filterData.startDate);
          if (vaccineDate < startDate) return false;
        }
        
        if (filterData.endDate) {
          const endDate = new Date(filterData.endDate);
          if (vaccineDate > endDate) return false;
        }
        
        return true;
      });
    }
    
    setFilters(filterData);
    setFilteredRecords(filtered);
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      vaccine: '',
      class: '',
      startDate: '',
      endDate: ''
    });
    setFilteredRecords(records);
    setIsFilterModalOpen(false);
  };

  // Get unique values for filters
  const getFilterOptions = () => {
    const vaccines = [...new Set(records.map(r => r.vaccine_name))];
    const classes = [...new Set(records.map(r => r.class_name))];
    
    return {
      vaccines: vaccines.map(v => ({ value: v, label: v })),
      classes: classes.map(c => ({ value: c, label: c }))
    };
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vaccination Reports</h1>
          <p className="text-gray-600 mt-1">
            Generate and view vaccination reports
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter Reports
        </Button>
      </div>

      {error && (
        <Alert
          variant="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      
      <Card>
        <ReportTable records={filteredRecords} />
      </Card>

      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Reports"
      >
        <ReportModalForm
          initialData={filters}
          options={getFilterOptions()}
          onSubmit={handleFilterSubmit}
          onReset={handleResetFilters}
          onCancel={() => setIsFilterModalOpen(false)}
        />
      </Modal>
    </PageLayout>
  );
};

export default ReportsPage;