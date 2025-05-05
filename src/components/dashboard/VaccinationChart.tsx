import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

interface VaccinationChartProps {
  totalStudents: number;
  vaccinatedStudents: number;
}

const VaccinationChart: React.FC<VaccinationChartProps> = ({ 
  totalStudents,
  vaccinatedStudents
}) => {
  const nonVaccinatedStudents = totalStudents - vaccinatedStudents;
  
  const data = {
    labels: ['Vaccinated', 'Not Vaccinated'],
    datasets: [
      {
        data: [vaccinatedStudents, nonVaccinatedStudents],
        backgroundColor: ['#34D399', '#F87171'],
        borderColor: ['#10B981', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = vaccinatedStudents + nonVaccinatedStudents;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vaccination Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VaccinationChart;