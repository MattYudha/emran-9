import React from 'react';
import Navbar from '../components/Navbar';
import UserProfileManager from '../components/UserProfileManager';
import Chatbot from '../components/Chatbot';

const UserProfile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-20">
        <UserProfileManager />
      </div>
      <Chatbot />
    </div>
  );
};

export default UserProfile;
