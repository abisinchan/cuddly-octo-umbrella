import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import AuthService from '../utils/auth';
import { REMOVE_RECIPE } from '../utils/mutations';
import RecipeRandom from '../components/RecipeRandom';
import RecipeForm from '../components/RecipeForm';
import RecipeList from '../components/RecipeList';

import { QUERY_RECIPES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_RECIPES);
  const recipes = data?.recipes || [];
  const isLoggedIn = AuthService.loggedIn();

  const [removeRecipe] = useMutation(REMOVE_RECIPE, {
    onError: (error) => {
      console.error('Error removing recipe:', error);
    },
    update: (cache, { data }) => {
      // Update the local cache after successful removal
      const removedRecipeId = data.removeRecipe._id;
      cache.modify({
        fields: {
          recipes(existingRecipes = [], { readField }) {
            return existingRecipes.filter(
              (recipeRef) => removedRecipeId !== readField('_id', recipeRef)
            );
          },
        },
      });
    },
  });


  const handleRemoveRecipe = async (recipeId) => {


    try {
      const { data } = await removeRecipe({
        variables: { recipeId },
      });
  
      if (data && data.removeRecipe) {
        const removedRecipeUserId = data.removeRecipe.createdBy._id;
        const userId = AuthService.getUserId(); // Get user ID from local storage

        if (removedRecipeUserId === userId) {
          console.log('Recipe removed successfully.');
          // Optionally, you can update the local state here if needed
        } else {
          console.error('Recipe does not belong to the current user.');
          // Provide feedback to the user that they can't delete this recipe
        }
      }
    } catch (error) {
      console.error('Error removing recipe:', error);
    }
  };
  

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          <RecipeForm />
        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            isLoggedIn ? (
              <RecipeList
                recipes={recipes}
                title="Recipes"
                isLoggedIn={isLoggedIn} // Pass isLoggedIn prop
                handleRemoveRecipe={handleRemoveRecipe} // Pass handleRemoveRecipe 
                authService={AuthService} // Pass the AuthService instanceprop
              />
            ) : (
              <RecipeRandom recipes={recipes} title="Random Recipe" />
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
