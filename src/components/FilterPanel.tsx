import React, { useState } from 'react';
import { useLenders } from '../context/LenderContext';
import { LoanType } from '../types';
import { Search, Filter, X, Percent, Clock, BarChart } from 'lucide-react';

const FilterPanel: React.FC = () => {
  const { 
    filterOptions, 
    setFilterOptions, 
    allLoanTypes,
    allLocations,
    resetFilters
  } = useLenders();
  
  const [isAdvancedFiltersExpanded, setIsAdvancedFiltersExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filterOptions.searchTerm || '');
  const [minLoan, setMinLoan] = useState<string>(filterOptions.minLoan?.toString() || '');
  const [maxLoan, setMaxLoan] = useState<string>(filterOptions.maxLoan?.toString() || '');
  const [minRate, setMinRate] = useState<string>(filterOptions.minRate?.toString() || '');
  const [maxRate, setMaxRate] = useState<string>(filterOptions.maxRate?.toString() || '');
  const [minTerm, setMinTerm] = useState<string>(filterOptions.minTerm?.toString() || '');
  const [maxTerm, setMaxTerm] = useState<string>(filterOptions.maxTerm?.toString() || '');
  const [maxLTV, setMaxLTV] = useState<string>(filterOptions.maxLTV?.toString() || '');
  const [selectedLocation, setSelectedLocation] = useState<string>(filterOptions.location || '');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilterOptions(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleMinLoanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinLoan(value);
    setFilterOptions(prev => ({ 
      ...prev, 
      minLoan: value ? parseInt(value, 10) : undefined 
    }));
  };

  const handleMaxLoanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxLoan(value);
    setFilterOptions(prev => ({ 
      ...prev, 
      maxLoan: value ? parseInt(value, 10) : undefined 
    }));
  };

  const handleMinRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinRate(value);
    setFilterOptions(prev => ({ 
      ...prev, 
      minRate: value ? parseFloat(value) : undefined 
    }));
  };

  const handleMaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxRate(value);
    setFilterOptions(prev => ({ 
      ...prev, 
      maxRate: value ? parseFloat(value) : undefined 
    }));
  };

  const handleMinTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinTerm(value);
    setFilterOptions(prev => ({ 
      ...prev, 
      minTerm: value ? parseInt(value, 10) : undefined 
    }));
  };

  const handleMaxTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxTerm(value);
    setFilterOptions(prev => ({ 
      ...prev, 
      maxTerm: value ? parseInt(value, 10) : undefined 
    }));
  };

  const handleMaxLTVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxLTV(value);
    setFilterOptions(prev => ({ 
      ...prev, 
      maxLTV: value ? parseInt(value, 10) : undefined 
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLocation(value);
    setFilterOptions(prev => ({
      ...prev,
      location: value || undefined
    }));
  };

  const handleLoanTypeToggle = (type: LoanType) => {
    setFilterOptions(prev => {
      const currentTypes = prev.loanTypes || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      
      return { ...prev, loanTypes: newTypes.length > 0 ? newTypes : undefined };
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setMinLoan('');
    setMaxLoan('');
    setMinRate('');
    setMaxRate('');
    setMinTerm('');
    setMaxTerm('');
    setMaxLTV('');
    setSelectedLocation('');
    resetFilters();
  };

  const hasActiveFilters = Object.values(filterOptions).some(value => 
    value !== undefined && 
    (typeof value !== 'object' || (Array.isArray(value) && value.length > 0))
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Find Lenders</h2>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button 
              onClick={handleReset}
              className="flex items-center text-sm text-red-600 hover:text-red-800"
            >
              <X size={16} className="mr-1" />
              Clear All
            </button>
          )}
          <button 
            onClick={() => setIsAdvancedFiltersExpanded(!isAdvancedFiltersExpanded)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Filter size={16} className="mr-1" />
            {isAdvancedFiltersExpanded ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search lenders by name or additional info..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Loan Types</h3>
        <div className="flex flex-wrap gap-2">
          {allLoanTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleLoanTypeToggle(type)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                filterOptions.loanTypes?.includes(type)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {isAdvancedFiltersExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Loan Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">£</span>
                </div>
                <input
                  type="number"
                  placeholder="Min loan amount"
                  value={minLoan}
                  onChange={handleMinLoanChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Loan Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">£</span>
                </div>
                <input
                  type="number"
                  placeholder="Max loan amount"
                  value={maxLoan}
                  onChange={handleMaxLoanChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Percent size={16} className="mr-1 text-blue-500" />
                Minimum Interest Rate
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Min interest rate"
                  value={minRate}
                  onChange={handleMinRateChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Percent size={16} className="mr-1 text-blue-500" />
                Maximum Interest Rate
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Max interest rate"
                  value={maxRate}
                  onChange={handleMaxRateChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Clock size={16} className="mr-1 text-green-500" />
                Minimum Term (years)
              </label>
              <input
                type="number"
                placeholder="Min term"
                value={minTerm}
                onChange={handleMinTermChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Clock size={16} className="mr-1 text-green-500" />
                Maximum Term (years)
              </label>
              <input
                type="number"
                placeholder="Max term"
                value={maxTerm}
                onChange={handleMaxTermChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BarChart size={16} className="mr-1 text-purple-500" />
                Maximum LTV (%)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
                <input
                  type="number"
                  placeholder="Max LTV"
                  value={maxLTV}
                  onChange={handleMaxLTVChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={handleLocationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {allLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;