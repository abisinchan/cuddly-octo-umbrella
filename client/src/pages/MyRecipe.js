
//import AuthService from '../utils/auth';
import MyRecipeList from '../components/MyRecipeList';


import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_MYRECIPES } from '../utils/queries';


const MyRecipe = () => {
    // Get the userId from the route parameters
    const { userId } = useParams();
  
    // Fetch the user's recipes using the GraphQL query
    const { loading, data } = useQuery(QUERY_MYRECIPES, {
      variables: { userId },
    });
  
    // Extract the user's recipes from the query data
    const userRecipes = data?.myRecipes || [];
  
    return (
      <div>
        <h2>My Recipes</h2>
        {loading ? <div>Loading...</div> : <MyRecipeList recipes={userRecipes} />} {/* Use MyRecipeList here */}
      </div>
    );
  };
  
  export default MyRecipe;
