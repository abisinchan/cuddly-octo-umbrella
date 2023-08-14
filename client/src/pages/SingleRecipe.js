import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

import { QUERY_RECIPE } from '../utils/queries';

const SingleRecipe = () => {
  const { recipeId } = useParams(); // Get recipeId from URL

  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId }, // Pass recipeId as a query variable
  });

  const recipe = data?.recipe || {};

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-3">
      <h3 className="card-header bg-dark text-light p-2 m-0">
        {recipe.title} <br />
        <span style={{ fontSize: '1rem' }}>
          Created by {recipe.createdBy.username} on {recipe.createdAt}
        </span>
      </h3>
      <div className="bg-light py-4">
        <blockquote
          className="p-4"
          style={{
            fontSize: '1.5rem',
            fontStyle: 'italic',
            border: '2px dotted #1a1a1a',
            lineHeight: '1.5',
          }}
        >
          <h5>{recipe.title}</h5>
          <p>Ingredients: {recipe.ingredients.join(', ')}</p>
          <p>Instructions: {recipe.instructions}</p>
        </blockquote>
      </div>

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
