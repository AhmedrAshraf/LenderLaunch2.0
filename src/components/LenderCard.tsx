import React from 'react';
import { Lender } from '../types';
import { Handshake, Globe, Phone, Mail, Percent, Banknote, Clock, MapPin, FileText, BarChart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LenderCardProps {
  lender: Lender;
}

const LenderCard: React.FC<LenderCardProps> = ({ lender }) => {
  const { isAuthenticated, toggleFavourite, isFavourite } = useAuth();
  const isFavourited = isFavourite(lender.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {lender.logo ? (
              <img 
                src={lender.logo} 
                alt={`${lender.name} logo`} 
                className="w-12 h-12 object-contain mr-4 rounded-md"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                <Handshake className="text-blue-600" size={24} />
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-800">{lender.name}</h3>
          </div>
          {isAuthenticated && (
            <button 
              onClick={() => toggleFavourite(lender.id)}
              className="focus:outline-none"
              aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
            >
              <Star 
                size={24} 
                className={`transition-colors ${isFavourited ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} 
              />
            </button>
          )}
        </div>
        
        <div className="space-y-3 mb-4">
          {(lender.minRate > 0 || lender.maxRate > 0) && (
            <div className="flex items-center text-sm text-gray-600">
              <Percent size={16} className="mr-2 text-blue-500" />
              <span>Rate Range: <span className="font-medium">{lender.minRate}% - {lender.maxRate}%</span></span>
            </div>
          )}
          
          {(lender.minLoan > 0 || lender.maxLoan > 0) && (
            <div className="flex items-center text-sm text-gray-600">
              <Banknote size={16} className="mr-2 text-green-500" />
              <span>Loan Range: <span className="font-medium">£{lender.minLoan.toLocaleString()} - £{lender.maxLoan.toLocaleString()}</span></span>
            </div>
          )}
          
          {(lender.minTerm > 0 || lender.maxTerm > 0) && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2 text-purple-500" />
              <span>Term: <span className="font-medium">{lender.minTerm} - {lender.maxTerm} years</span></span>
            </div>
          )}

          {lender.maxLoanToValue > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <BarChart size={16} className="mr-2 text-orange-500" />
              <span>Max LTV: <span className="font-medium">{lender.maxLoanToValue}%</span></span>
            </div>
          )}

          {lender.coveredLocation && lender.coveredLocation.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-2 text-red-500" />
              <span>Locations: <span className="font-medium">{lender.coveredLocation.join(', ')}</span></span>
            </div>
          )}
        </div>
        
        {lender.loanTypes && lender.loanTypes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Loan Types:</h4>
            <div className="flex flex-wrap gap-1">
              {lender.loanTypes.map((type, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {lender.criteriaSheets && lender.criteriaSheets.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Criteria Sheets:</h4>
            <div className="flex flex-wrap gap-1">
              {lender.criteriaSheets.map((sheet, index) => (
                <a 
                  key={index}
                  href={sheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-200"
                >
                  <FileText size={12} className="mr-1" />
                  {sheet.name}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-3 mt-3 border-t border-gray-200">
          <Link 
            to={`/lender/${lender.id}`}
            className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LenderCard;