import React from 'react';
import UserRecipes from '../components/UserRecipes'; // Import the UserRecipes component

const UserProfilePage = () => {
  return (
    <div>
      <h1>User Profile</h1>
      <UserRecipes /> {/* Render the UserRecipes component */}
    </div>
  );
};

export default UserProfilePage;
