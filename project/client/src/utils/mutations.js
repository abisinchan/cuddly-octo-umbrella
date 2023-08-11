import { gql } from '@apollo/client';

export const ADD_USER = gql`
mutation AddUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username

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
    }
  }
}
}
`;



export const ADD_RECIPE= gql`
mutation AddRecipe($title: String, $ingredients: [String], $instructions: String) {
  addRecipe(title: $title, ingredients: $ingredients, instructions: $instructions) {
    _id
    title
    ingredients
    instructions
    createdAt
    comments {
      _id
      commentText
      commentAuthor
      createdAt
    }
  }
}
`;

export const ADD_COMMENT = gql`
mutation AddComment($recipeId: ID!, $commentText: String, $commentAuthor: String) {
  addComment(recipeId: $recipeId, commentText: $commentText, commentAuthor: $commentAuthor) {
    _id
    comments {
      commentText
      commentAuthor
      createdAt
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
