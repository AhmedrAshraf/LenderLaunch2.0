import React from 'react';
import { useLenders } from '../context/LenderContext';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Percent, Handshake, Briefcase, FileText, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { lenders, allLoanTypes } = useLenders();
  const { isAdmin, favouriteLenders } = useAuth();

  // Calculate stats
  const loanTypeStats = allLoanTypes.map(type => ({
    type,
    count: lenders.filter(lender => lender.loanTypes.includes(type)).length
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const avgMinRate = Math.round(
    (lenders.reduce((sum, lender) => sum + lender.minRate, 0) / lenders.length) * 100
  ) / 100;

  const avgMaxLoan = Math.round(
    lenders.reduce((sum, lender) => sum + lender.maxLoan, 0) / lenders.length
  );

  // Get recently added lenders
  const recentLenders = [...lenders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Count total criteria sheets
  const totalCriteriaSheets = lenders.reduce(
    (sum, lender) => sum + (lender.criteriaSheets ? lender.criteriaSheets.length : 0), 0
  );

  // Count favourites
  const favouriteCount = favouriteLenders.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lender Dashboard</h1>
        <p className="text-gray-600">
          Manage and search for lenders to match with your client cases
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Handshake size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lenders</p>
              <p className="text-2xl font-semibold text-gray-900">{lenders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Percent size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Min Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{avgMinRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Criteria Sheets</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCriteriaSheets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <Star size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Favourites</p>
              <p className="text-2xl font-semibold text-gray-900">{favouriteCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Loan Types</h2>
          <div className="space-y-4">
            {loanTypeStats.map(({ type, count }) => (
              <div key={type} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(count / lenders.length) * 100}%` }}
                  ></div>
                </div>
                <div className="min-w-[120px] ml-4 flex justify-between">
                  <span className="text-sm text-gray-700">{type}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/search"
              className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              <Search className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">Search Lenders</p>
                <p className="text-sm text-blue-600">Find the perfect match for your client</p>
              </div>
            </Link>
            <Link
              to="/favourites"
              className="flex items-center p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100"
            >
              <Star className="h-5 w-5 mr-3" />
              <div>
                <p className="font-medium">My Favourites</p>
                <p className="text-sm text-yellow-600">View your saved lenders</p>
              </div>
            </Link>
            {isAdmin && (
              <Link
                to="/add"
                className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
              >
                <PlusCircle className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Add New Lender</p>
                  <p className="text-sm text-green-600">Expand your lender database</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recently Added Lenders</h2>
          <Link 
            to="/search" 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            View All <span className="ml-1">→</span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Loan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Types
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentLenders.map((lender) => (
                <tr key={lender.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/lender/${lender.id}`} className="text-blue-600 hover:text-blue-800">
                      {lender.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lender.minRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    £{lender.maxLoan.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {lender.loanTypes.slice(0, 2).map((type, index) => (
                        <span 
                          key={index} 
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          {type}
                        </span>
                      ))}
                      {lender.loanTypes.length > 2 && (
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                          +{lender.loanTypes.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lender.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;