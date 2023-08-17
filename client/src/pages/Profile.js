import React, { useEffect, useState }  from 'react';
import { useQuery, useMutation } from '@apollo/client';


import RecipeForm from '../components/RecipeForm';
import MyRecipeList from '../components/MyRecipeList';

import AuthService from '../utils/auth';
import { QUERY_USER, QUERY_SAVED_RECIPES } from '../utils/queries';
import { REMOVE_RECIPE } from '../utils/mutations';

const Profile = () => {
  // Fetch user's recipes using useQuery hook
  const userId = AuthService.getUserId(); // Get user ID from local storage
  const { loading: userLoading, data: userData } = useQuery(QUERY_USER, {
    variables: { userId },
  });

  const { loading: savedRecipesLoading, data: savedRecipesData } = useQuery(QUERY_SAVED_RECIPES, {
    variables: { userId: AuthService.getProfile().id },
  });
  const [userRecipes, setUserRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    if (userData?.user) {
      setUserRecipes(userData.user.recipes || []);
    }
  }, [userData]);

  useEffect(() => {
    if (savedRecipesData?.user) {
      setSavedRecipes(savedRecipesData.user.savedRecipes || []);
    }
  }, [savedRecipesData]);
  

  const [removeRecipe] = useMutation(REMOVE_RECIPE, {
    onError: (error) => {
      console.error('Error removing recipe:', error);
    },
    update: (cache, { data }) => {
      const removedRecipeId = data.removeRecipe._id;
      setUserRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== removedRecipeId));
    },
  });

  const handleRemoveRecipe = async (recipeId) => {
    try {
      const { data } = await removeRecipe({
        variables: { recipeId },
      });

      if (data && data.removeRecipe) {
        const removedRecipeUserId = data.removeRecipe.createdBy._id;
        const userId = AuthService.getUserId();

        if (removedRecipeUserId === userId) {
          console.log('Recipe removed successfully.');
        } else {
          console.error('Recipe does not belong to the current user.');
        }
      }
    } catch (error) {
      console.error('Error removing recipe:', error);
    }
  };

  const addRecipeToList = (newRecipe) => {
    setUserRecipes(prevRecipes => [newRecipe, ...prevRecipes]);
  };

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          <RecipeForm addRecipeToList={addRecipeToList}/>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-md-7">
              <h2>Your Recipes</h2>
              {userLoading ?  <div>Loading...</div> : 
              <MyRecipeList 
              recipes={userRecipes} 
              handleRemoveRecipe={handleRemoveRecipe} // Pass the handleRemoveRecipe function
              authService={AuthService} // Pass the AuthService instance
              />}
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
