import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_RECIPE } from '../../utils/mutations';
import { QUERY_RECIPES, QUERY_MYRECIPES } from '../../utils/queries';

import Auth from '../../utils/auth';

const RecipeForm = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');

  const [addRecipe, { error }] = useMutation(ADD_RECIPE, {
    update(cache, { data: { addRecipe } }) {
      try {
        const { recipes } = cache.readQuery({ query: QUERY_RECIPES });
  
        cache.writeQuery({
          query: QUERY_RECIPES,
          data: { recipes: [addRecipe, ...recipes] },
        });
      } catch (e) {
        console.error(e);
      }
  
      // Read the 'me' data from the cache if available
      const cachedMe = cache.readQuery({ query: QUERY_MYRECIPES });
  
      // Update the 'me' data in the cache
      cache.writeQuery({
        query: QUERY_MYRECIPES,
        data: {
          me: {
            ...cachedMe?.me,
            recipes: [...(cachedMe?.me?.recipes || []), addRecipe],
          },
        },
      });
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addRecipe({
        variables: {
          title,
          ingredients,
          instructions,
        },
      });

      setTitle('');
      setIngredients([]);
      setInstructions('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleIngredientChange = (event) => {
    const { value } = event.target;
    setIngredients(value.split(','));
  };

  return (
    <div>
      <h3>Add a New Recipe</h3>

      {Auth.loggedIn() ? (
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients</label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={ingredients.join(', ')}
              onChange={handleIngredientChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>

          <button className="btn btn-primary" type="submit">
            Add Recipe
          </button>
          
          {error && (
            <div className="my-3 bg-danger text-white p-3">
              {error.message}
            </div>
          )}
        </form>
      ) : (
        <p>
          You need to be logged in to add a recipe. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default RecipeForm;
