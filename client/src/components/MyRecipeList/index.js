
import React from 'react';
import { Link } from 'react-router-dom';

const MyRecipeList = ({ recipes }) => {
  return (
    <div>
      {recipes.length === 0 ? (
        <div>No recipes yet.</div>
      ) : (
        <div>
          {recipes.map(recipe => (
            <div key={recipe._id} className="card mb-3">
              <h4 className="card-header bg-primary text-light p-2 m-0">
                Created by {recipe.createdBy.username} <br />
                <span style={{ fontSize: '1rem' }}>
                  Created on {recipe.createdAt}
                </span>
              </h4>
              <div className="card-body bg-light p-2">
                <h5>{recipe.title}</h5>
                <p>Ingredients: {recipe.ingredients.join(', ')}</p>
                <p>Instructions: {recipe.instructions}</p>
              </div>
              <Link
                className="btn btn-primary btn-block btn-squared"
                to={`/recipes/${recipe._id}`}
              >
                View Recipe Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipeList;
