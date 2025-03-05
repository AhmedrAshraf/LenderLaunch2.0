import React from 'react';
import { useNavigate } from 'react-router-dom';
import LenderForm from '../components/LenderForm';

const AddLenderPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Lender</h1>
        <p className="text-gray-600">
          Add a new lender to your database with all their details and loan programs
        </p>
      </div>
      
      <LenderForm 
        onSubmit={() => navigate('/search')} 
        onCancel={() => navigate(-1)} 
      />
    </div>
  );
};

export default AddLenderPage;