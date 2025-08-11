import React from 'react';
import { useNavigate } from 'react-router-dom';

const ListingSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Item Listed Successfully!</h1>
          <p className="text-gray-600">Your item has been added to the rental marketplace and is now available for other users to rent.</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            View My Dashboard
          </button>
          <button
            onClick={() => navigate('/rental-shop')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Browse Marketplace
          </button>
          <button
            onClick={() => navigate('/list-item')}
            className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 px-4 transition-colors"
          >
            List Another Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingSuccess;