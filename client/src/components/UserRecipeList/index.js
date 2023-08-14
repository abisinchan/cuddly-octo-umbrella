import React from 'react';
import { Link } from 'react-router-dom';

const RecipeList = ({
  recipes,
  title,
  showTitle = true,
  showUsername = true,
}) => {
  if (!recipes.length) {
    return <h3>No Recipes Yet</h3>;
  }

  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {recipes.map((recipe) => (
        <div key={recipe._id} className="card mb-3">
      

          <h4 className="card-header bg-primary text-light p-2 m-0">
            {showUsername ? (
              <Link
                className="text-light"
                to={`/recipes/${recipe._id}`} // 
              >
                Created by {recipe.createdBy.username} <br />
                <span style={{ fontSize: '1rem' }}>
                  Created on {recipe.createdAt}
                </span>
              </Link>
            ) : (
              <>
                <span style={{ fontSize: '1rem' }}>
                  Created on {recipe.createdAt}
                </span>
              </>
            )}
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
  );
};

export default RecipeList;
