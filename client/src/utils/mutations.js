import { gql } from '@apollo/client';

export const ADD_USER = gql`
mutation AddUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      password
    }
  }
}
`;

export const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
      _id
      username
      password
    }
  }
}
`;

export const ADD_RECIPE = gql`
mutation AddRecipe($title: String!, $ingredients: [String]!, $instructions: String!) {
  addRecipe(title: $title, ingredients: $ingredients, instructions: $instructions) {
    _id
    title
    ingredients
    instructions
    createdBy {
      username
    }
    comments {
      _id
      commentText
      commentAuthor {
        username
      }
      createdAt
    }
  }
}
`;

export const ADD_COMMENT = gql`
mutation AddComment($recipeId: ID!, $commentText: String!) {
  addComment(recipeId: $recipeId, commentText: $commentText) {
    _id
    comments {
      _id
      commentText
      createdAt
      commentAuthor {
        username
      }
    }
  }
}
`;

export const REMOVE_RECIPE = gql`
mutation RemoveRecipe($recipeId: ID!) {
  removeRecipe(recipeId: $recipeId) {
    _id
  }
}
`;

export const REMOVE_COMMENT = gql`
mutation RemoveComment($recipeId: ID!, $commentId: ID!) {
  removeComment(recipeId: $recipeId, commentId: $commentId) {
    _id
    comments {
      _id
    }
  }
}
`;

