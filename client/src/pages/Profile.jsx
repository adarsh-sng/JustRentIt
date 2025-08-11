import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Profile image must be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    try {
      // Create FormData if there's a profile image
      if (profileImage) {
        const uploadData = new FormData();
        Object.keys(formData).forEach(key => {
          uploadData.append(key, formData[key]);
        });
        uploadData.append('profileImage', profileImage);
        
        // TODO: Replace with actual API call
        // await updateUser(uploadData);
      } else {
        await updateUser(formData);
      }
      
      setIsEditing(false);
      setProfileImage(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      pincode: user?.pincode || ''
    });
    setIsEditing(false);
    setProfileImage(null);
    setProfileImagePreview(user?.profileImage || null);
    
    // Clean up preview URL if it was created
    if (profileImagePreview && !user?.profileImage) {
      URL.revokeObjectURL(profileImagePreview);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="max-w-2xl">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleCancel}
                  className="text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Profile Picture */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                {profileImagePreview ? (
                  <img 
                    src={profileImagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Change photo
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{user?.name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{user?.email || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{user?.phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              ) : (
                <p>{user?.address || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{user?.city || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Pincode</label>
              {isEditing ? (
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{user?.pincode || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;