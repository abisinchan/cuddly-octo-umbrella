const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    recipes: [Recipe]
   
  }

  type Recipe {
    _id: ID!
    title: String!
    ingredients: [String]!
    instructions: String!
    createdBy: User!
    comments: [Comment]
    createdAt: String
 
  }

  type Comment {
    _id: ID!
    commentText: String!
    commentAuthor: User!
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(userId: ID!): User
    recipes: [Recipe]
    recipe(recipeId: ID!): Recipe
    myRecipes(userId: ID!): [Recipe]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    addRecipe(title: String!, ingredients: [String]!, instructions: String!): Recipe
    addComment(recipeId: ID!, commentText: String!): Recipe
    removeRecipe(recipeId: ID!): Recipe
    removeComment(recipeId: ID!, commentId: ID!): Recipe
    saveRecipe(recipeId: ID!): User
  }
`;

module.exports = typeDefs;
