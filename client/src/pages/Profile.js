import React from 'react';
import { useQuery } from '@apollo/client';
import AuthService from '../utils/auth'; // Import your AuthService
import RecipeForm from '../components/RecipeForm';
import UserRecipeList from '../components/UserRecipeList';
import { QUERY_RECIPES } from '../utils/queries';

const Profile = () => {
  const { loading, data } = useQuery(QUERY_RECIPES);
  const recipes = data?.recipes || [];
  
  // Get the logged-in user's ID from AuthService
  const loggedInUserId = AuthService.getProfile().id;

  // Filter recipes based on the logged-in user's ID
  const userRecipes = recipes.filter(recipe => recipe.creator === loggedInUserId);

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          <RecipeForm />
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-md-7">
              <h2>Your Recipes</h2>
              {loading ? <div>Loading...</div> : <UserRecipeList recipes={userRecipes} />}
            </div>
            <div className="col-md-4">
              <h2>Saved Recipes</h2>
              {/* Replace with your logic to display saved recipes from others */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
