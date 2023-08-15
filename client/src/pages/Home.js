import React from 'react';
import { useQuery } from '@apollo/client';
import AuthService from '../utils/auth';

import RecipeRandom from '../components/RecipeRandom';
import RecipeForm from '../components/RecipeForm';
import RecipeList from '../components/RecipeList';

import { QUERY_RECIPES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_RECIPES);
  const recipes = data?.recipes || [];
  const isLoggedIn = AuthService.loggedIn();

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
        <RecipeList recipes={recipes} title="Recipes" />
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
