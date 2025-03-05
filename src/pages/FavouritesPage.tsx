import React from 'react';
import { useLenders } from '../context/LenderContext';
import { useAuth } from '../context/AuthContext';
import LenderCard from '../components/LenderCard';
import { Star, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const FavouritesPage: React.FC = () => {
  const { lenders } = useLenders();
  const { favouriteLenders } = useAuth();
  
  const favouriteLendersList = lenders.filter(lender => 
    favouriteLenders.includes(lender.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Favourite Lenders</h1>
        <p className="text-gray-600">
          Your collection of saved lenders for quick access
        </p>
      </div>

      {favouriteLendersList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favouriteLendersList.map(lender => (
            <LenderCard key={lender.id} lender={lender} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favourite lenders yet</h3>
          <p className="text-gray-600 mb-4">
            Add lenders to your favourites by clicking the star icon on any lender card.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Search className="mr-2 h-4 w-4" />
            Browse Lenders
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;