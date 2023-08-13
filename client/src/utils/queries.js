import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
query Users {
  users {
    _id
    username
    email
    password
    recipes {
      _id
      title
      ingredients
      instructions
      createdAt
      comments {
        _id
        commentText
        createdAt
      }
    }
  }
}
`;

export const QUERY_USER = gql`
query User($username: String!) {
    user(username: $username) {
      _id
      username
      email
      password
      recipes {
        _id
        title
        ingredients
        instructions
        createdAt
        comments {
          _id
          commentText
          createdAt
        }
      }
    }
  }
`;
export const QUERY_RECIPES = gql`
query Recipes {
  recipes {
    _id
    title
    ingredients
    instructions
    createdAt
    comments {
      _id
      commentText
      commentAuthor {
        _id
        email
        username
      }
      createdAt
    }
  }
}
`;

export const QUERY_RECIPE = gql`
query Recipe($recipeId: ID!) {
  recipe(recipeId: $recipeId) {
    _id
    title
    ingredients
    instructions
    createdAt
    comments {
      _id
      commentText
      createdAt
    }
  }
}
`;

export const QUERY_ME = gql`
query Me {
    me {
      _id
      username
      email
      password
      recipes {
        _id
        title
        ingredients
        instructions
        createdAt
        comments {
          _id
          commentText
          createdAt
      }
    }
  }
}
`;