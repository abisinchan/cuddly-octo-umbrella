import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';

import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

import { QUERY_RECIPE, SAVE_RECIPE } from '../utils/queries';

const SingleRecipe = () => {
  const { recipeId } = useParams();

  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });

  const recipe = data?.recipe; // Use optional chaining to handle potential undefined data

  const [saveRecipe] = useMutation(SAVE_RECIPE, {
    variables: { recipeId: recipe?._id }, // Use optional chaining here as well
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-3">
      {/* Render the recipe data */}
      <h2>{recipe.title}</h2>
      <p>Ingredients: {recipe.ingredients.join(', ')}</p>
      <p>Instructions: {recipe.instructions}</p>
      <p>Created by: {recipe.createdBy.username}</p>
            <button
        className="btn btn-primary"
        onClick={() => {
          saveRecipe();
        }}
      >
        Save Recipe
      </button>
      {/* ... Other content ... */}
      <div className="my-5">
        <CommentList comments={recipe.comments} />
      </div>
      <div className="m-3 p-4" style={{ border: '1px dotted #1a1a1a' }}>
        <CommentForm recipeId={recipe._id} />
      </div>

    </div>
  );
};

export default SingleRecipe;