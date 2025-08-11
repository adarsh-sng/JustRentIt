import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { Button } from '../components/ui';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleExploreMarketplace = () => {
    navigate('/rental-shop');
  };

  const handleListItem = () => {
    if (isAuthenticated) {
      navigate('/list-item');
    } else {
      navigate('/login', { state: { from: { pathname: '/list-item' } } });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rent what you need, earn from what you own
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            JustRentIt connects people who need items with those who have them. 
            Rent anything from cameras to tools, or list your items to earn extra income.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {/* Browse Items */}
          <div className="border border-gray-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Browse Items</h2>
            <p className="text-gray-600 mb-4">
              Find cool items,rent it according to your need 
            </p>
            <Button onClick={handleExploreMarketplace} className="w-full">
              Start Browsing
            </Button>
          </div>

          {/* List Items */}
          <div className="border border-gray-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">List Your Items</h2>
            <p className="text-gray-600 mb-4">
              Turn your unused items into income by renting them out.
            </p>
            <Button onClick={handleListItem} variant="outline" className="w-full">
              Start Earning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;