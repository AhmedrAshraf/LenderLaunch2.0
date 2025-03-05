import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LenderProvider } from './context/LenderContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import LenderDetail from './pages/LenderDetail';
import AddLenderPage from './pages/AddLenderPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import FavouritesPage from './pages/FavouritesPage';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LenderProvider>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/favourites" element={
                  <ProtectedRoute>
                    <FavouritesPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/lender/:id" element={
                  <ProtectedRoute>
                    <LenderDetail />
                  </ProtectedRoute>
                } />
                
                <Route path="/add" element={
                  <ProtectedRoute requireAdmin>
                    <AddLenderPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/users" element={
                  <ProtectedRoute requireAdmin>
                    <UsersPage />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </LenderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;