import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Handshake, Search, PlusCircle, Home, LogOut, Users, Star, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Handshake className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Lender Launch 2.0</span>
            </Link>
            
            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex ml-6 items-center space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Home className="inline-block mr-1 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/search"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/search'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Search className="inline-block mr-1 h-4 w-4" />
                  Search Lenders
                </Link>
                <Link
                  to="/favourites"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/favourites'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Star className="inline-block mr-1 h-4 w-4" />
                  Favourites
                </Link>
                {currentUser?.is_admin && (
                  <>
                    <Link
                      to="/add"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/add'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <PlusCircle className="inline-block mr-1 h-4 w-4" />
                      Add Lender
                    </Link>
                    <Link
                      to="/users"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/users'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Users className="inline-block mr-1 h-4 w-4" />
                      Manage Users
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <span className="hidden md:block text-sm text-gray-700 mr-4">
                  {currentUser?.is_admin ? 'Admin' : 'User'}: <span className="font-medium">{currentUser?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </button>
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden ml-2 p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Home className="inline-block mr-2 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/search"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/search'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Search className="inline-block mr-2 h-5 w-5" />
              Search Lenders
            </Link>
            <Link
              to="/favourites"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/favourites'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Star className="inline-block mr-2 h-5 w-5" />
              Favourites
            </Link>
            {currentUser?.is_admin && (
              <>
                <Link
                  to="/add"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/add'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <PlusCircle className="inline-block mr-2 h-5 w-5" />
                  Add Lender
                </Link>
                <Link
                  to="/users"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/users'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Users className="inline-block mr-2 h-5 w-5" />
                  Manage Users
                </Link>
              </>
            )}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="px-3">
                <p className="text-base font-medium text-gray-800">
                  {currentUser?.username}
                </p>
                <p className="text-sm text-gray-500">
                  {currentUser?.is_admin ? 'Administrator' : 'Regular User'}
                </p>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <LogOut className="inline-block mr-2 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;