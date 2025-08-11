import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [rentedItems, setRentedItems] = useState([]);
  const [listedItems, setListedItems] = useState([]);

  useEffect(() => {
    // Load user's rented items from localStorage
    const rented = JSON.parse(localStorage.getItem('userRentedItems') || '[]');
    setRentedItems(rented.filter(item => item.userId === user?.id));

    // Load user's listed items from localStorage
    const listed = JSON.parse(localStorage.getItem('userListedItems') || '[]');
    setListedItems(listed.filter(item => item.ownerId === user?.id));
  }, [user]);

  const handleReturnItem = (itemId) => {
    const updatedRented = rentedItems.map(item => 
      item.id === itemId 
        ? { ...item, status: 'returned', returnDate: new Date().toISOString() }
        : item
    );
    setRentedItems(updatedRented);
    
    // Update localStorage
    const allRented = JSON.parse(localStorage.getItem('userRentedItems') || '[]');
    const updatedAll = allRented.map(item => 
      item.id === itemId 
        ? { ...item, status: 'returned', returnDate: new Date().toISOString() }
        : item
    );
    localStorage.setItem('userRentedItems', JSON.stringify(updatedAll));
  };

  const handleEditItem = (item) => {
    // Store item data for editing
    localStorage.setItem('editingItem', JSON.stringify(item));
    navigate('/list-item');
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      const updatedListed = listedItems.filter(item => item.id !== itemId);
      setListedItems(updatedListed);
      
      // Update localStorage
      localStorage.setItem('userListedItems', JSON.stringify(updatedListed));
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'rented', name: 'My Rentals' },
    { id: 'listed', name: 'My Listed Items' }
  ];

  const stats = {
    totalRented: rentedItems.length,
    activeRentals: rentedItems.filter(item => item.status === 'active').length,
    totalListed: listedItems.length,
    totalEarnings: listedItems.reduce((sum, item) => sum + (item.earnings || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-2xl font-bold text-gray-900">{stats.totalRented}</div>
                <div className="text-sm text-gray-600">Total Rentals</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-2xl font-bold text-blue-600">{stats.activeRentals}</div>
                <div className="text-sm text-gray-600">Active Rentals</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-2xl font-bold text-gray-900">{stats.totalListed}</div>
                <div className="text-sm text-gray-600">Listed Items</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-2xl font-bold text-green-600">Rs {stats.totalEarnings}</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => navigate('/rental-shop')}
                  className="w-full"
                >
                  Browse Items
                </Button>
                <Button 
                  onClick={() => navigate('/list-item')}
                  variant="outline"
                  className="w-full"
                >
                  List New Item
                </Button>
                <Button 
                  onClick={() => setActiveTab('rented')}
                  variant="ghost"
                  className="w-full"
                >
                  View My Rentals
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              {rentedItems.length === 0 && listedItems.length === 0 ? (
                <p className="text-gray-500">No recent activity. Start by renting or listing an item!</p>
              ) : (
                <div className="space-y-3">
                  {rentedItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm text-gray-900">Rented: {item.productName}</span>
                        <span className="ml-2 text-xs text-gray-500">({item.status})</span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(item.rentDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {listedItems.slice(0, 2).map((item, index) => (
                    <div key={`listed-${index}`} className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm text-gray-900">Listed: {item.productName}</span>
                        <span className="ml-2 text-xs text-green-600">(Available)</span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rented Items Tab */}
        {activeTab === 'rented' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">My Rentals</h2>
              <Button onClick={() => navigate('/rental-shop')}>
                Rent More Items
              </Button>
            </div>

            {rentedItems.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">You haven't rented any items yet.</p>
                <Button onClick={() => navigate('/rental-shop')}>
                  Browse Items to Rent
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {rentedItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          <p className="text-sm text-gray-500">
                            Rented: {new Date(item.rentDate).toLocaleDateString()} 
                            {item.returnDate && ` - Returned: ${new Date(item.returnDate).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">Rs {item.totalPrice}</div>
                          <div className="text-sm text-gray-500">{item.days} days</div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            item.status === 'active' ? 'bg-blue-100 text-blue-600' :
                            item.status === 'returned' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {item.status || 'active'}
                          </span>
                        </div>
                        {item.status === 'active' && (
                          <Button 
                            onClick={() => handleReturnItem(item.id)}
                            variant="outline"
                            size="sm"
                          >
                            Return Item
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Listed Items Tab */}
        {activeTab === 'listed' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">My Listed Items</h2>
              <Button onClick={() => navigate('/list-item')}>
                List New Item
              </Button>
            </div>

            {listedItems.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">You haven't listed any items yet.</p>
                <Button onClick={() => navigate('/list-item')}>
                  List Your First Item
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {listedItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          <p className="text-sm text-gray-500">
                            Listed: {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">Rs {item.productPrice}/day</div>
                          <div className="text-sm text-gray-500">{item.availability}</div>
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                            Active
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleEditItem(item)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button 
                            onClick={() => handleRemoveItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;