import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';

import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

import AuthService from '../utils/auth';
import { QUERY_RECIPE, SAVE_RECIPE } from '../utils/queries';
import { REMOVE_COMMENT } from '../utils/mutations';

const SingleRecipe = () => {
  const { recipeId } = useParams();

  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });

  const recipe = data?.recipe;

  const [saveRecipe] = useMutation(SAVE_RECIPE, {
    variables: { recipeId: recipe?._id },
  });

  const [removeComment] = useMutation(REMOVE_COMMENT, {
    onError: (error) => {
      console.error('Error removing comment:', error);
    },
    update: (cache, { data }) => {
      const removedCommentId = data.removeComment._id;
      cache.modify({
        id: cache.identify(recipe),
        fields: {
          comments(existingComments = [], { readField }) {
            return existingComments.filter(
              (commentRef) => removedCommentId !== readField('_id', commentRef)
            );
          },
        },
      });
    },
  });

  const handleRemoveComment = async (commentId) => {
    try {
      const { data } = await removeComment({
        variables: { recipeId: recipe._id, commentId },
      });

      if (data && data.removeComment) {
        console.log('Comment removed successfully.');
      }
    } catch (error) {
      console.error('Error removing comment:', error);
    }
  };

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
      <CommentList 
      comments={recipe.comments}
      handleRemoveComment={handleRemoveComment}
      authService={AuthService} // Pass the AuthService instance
      />
      </div>
      <div className="m-3 p-4" style={{ border: '1px dotted #1a1a1a' }}>
        <CommentForm recipeId={recipe._id} />
      </div>

    </div>
  );
};

export default SingleRecipe;