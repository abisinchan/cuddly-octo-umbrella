import React from 'react';


const UserRecipes = ({ user }) => {
  if (!user) {
    return null; // Handle the case where user data is not available
  }

  return (
    <div>
      <h2>{user.username}'s Recipes</h2>
      <ul>
        {user.recipes.map(recipe => (
          <li key={recipe._id}>
            <h3>{recipe.title}</h3>
            <p>Ingredients: {recipe.ingredients}</p>
            <p>Instructions: {recipe.instructions}</p>
            <p>Created By: {recipe.createdBy.username}</p>
            <p>Comments:</p>
            <ul>
              {recipe.comments.map(comment => (
                <li key={comment._id}>
                  <p>{comment.commentText}</p>
                  <p>Comment By: {comment.commentAuthor ? comment.commentAuthor.username : 'Anonymous'}</p>
                  <p>Created At: {comment.createdAt}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRecipes;
