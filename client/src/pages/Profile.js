import React from 'react';
import { useQuery } from '@apollo/client';
import AuthService from '../utils/auth';
import RecipeForm from '../components/RecipeForm';
import UserRecipeList from '../components/UserRecipeList';
import { QUERY_MYRECIPES, QUERY_SAVED_RECIPES } from '../utils/queries';

const Profile = () => {
  const { loading: myRecipesLoading, data: myRecipesData } = useQuery(QUERY_MYRECIPES, {
    variables: { userId: AuthService.getProfile().id },
  });

  const { loading: savedRecipesLoading, data: savedRecipesData } = useQuery(QUERY_SAVED_RECIPES, {
    variables: { userId: AuthService.getProfile().id },
  });

  const userRecipes = myRecipesData?.myRecipes || [];
  const savedRecipes = savedRecipesData?.user?.savedRecipes || [];

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
              {myRecipesLoading ? <div>Loading...</div> : <UserRecipeList recipes={userRecipes} />}
            </div>
            <div className="col-md-4">
              <h2>Saved Recipes</h2>
              {savedRecipesLoading ? <div>Loading...</div> : (
                <ul>
                  {savedRecipes.map(recipe => (
                    <li key={recipe._id}>
                      <h3>{recipe.title}</h3>
                      <p>Created by {recipe.createdBy.username}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
