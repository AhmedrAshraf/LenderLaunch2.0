import React, { useState } from 'react';
import { useLenders } from '../context/LenderContext';
import FilterPanel from '../components/FilterPanel';
import LenderCard from '../components/LenderCard';
import { Search, ArrowUpDown } from 'lucide-react';

const SearchPage: React.FC = () => {
  const { filteredLenders, filterOptions } = useLenders();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const hasActiveFilters = Object.values(filterOptions).some(value => 
    value !== undefined && 
    (typeof value !== 'object' || (Array.isArray(value) && value.length > 0))
  );

  const sortedLenders = [...filteredLenders].sort((a, b) => {
    return sortOrder === 'asc' 
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Lenders</h1>
        <p className="text-gray-600">
          Find the perfect lender for your client's specific needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>
        
        <div className="lg:col-span-3">
          {sortedLenders.length > 0 ? (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  {sortedLenders.length} lender{sortedLenders.length !== 1 ? 's' : ''} found
                  {hasActiveFilters ? ' matching your criteria' : ''}
                </p>
                <button
                  onClick={toggleSort}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowUpDown className="h-4 w-4 mr-1.5" />
                  Sort {sortOrder === 'asc' ? 'A to Z' : 'Z to A'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedLenders.map(lender => (
                  <LenderCard key={lender.id} lender={lender} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lenders found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more results.' 
                  : 'There are no lenders in the database yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;