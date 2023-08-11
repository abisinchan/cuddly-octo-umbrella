const { AuthenticationError } = require('apollo-server-express');
const { User, Recipe} = require('../models'); 
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
  // find all users and their recipes
  users: async () => {
    return User.find().populate('recipes');
  },

  // Resolver to fetch a user by their username, including their recipes
  user: async (parent, { username }) => {
    return User.findOne({ username }).populate('recipes');
  },

  // Resolver to fetch recipes, optionally filtered by username, sorted by creation date (newest to oldest)
 recipes: async (parent, { username }) => {
    // If a username is provided, use it as a filter; otherwise, return all recipes
    const params = username ? { username } : {};
    return Recipe.find(params).sort({ createdAt: -1 }); // Sort by creation date in descending order
  },

  // Resolver to fetch a recipe by its ID
  recipe: async (parent, { recipeId }) => {
    return Recipe.findOne({ _id: recipeId });
  },

  // Resolver to fetch the currently logged-in user
  me: async (parent, args, context) => {
    // Check if a user is authenticated
    if (context.user) {
      // If authenticated, find the user by their ID and populate their recipes
      return User.findOne({ _id: context.user._id }).populate('recipes');
    }
    // If not authenticated, throw an error indicating the need to log in
    throw new AuthenticationError('You need to be logged in!');
  },
},

Mutation: {
  // Resolver to add a new user
  addUser: async (parent, { username, email, password }) => {
    // Create a new user in the database with the provided information
    const user = await User.create({ username, email, password });

    // Generate an authentication token for the newly created user
    const token = signToken(user);

    // Return the authentication token and the user object
    return { token, user };
  },

  // Resolver for user login
  login: async (parent, { email, password }) => {
    // Find a user in the database using the provided email
    const user = await User.findOne({ email });

    // If no user is found with the provided email, throw an error
    if (!user) {
      throw new AuthenticationError('No user found with this email address');
    }

    // Check if the provided password matches the user's stored password
    const correctPw = await user.isCorrectPassword(password);

    // If the password is incorrect, throw an error
    if (!correctPw) {
      throw new AuthenticationError('Incorrect credentials');
    }

    // Generate an authentication token for the authenticated user
    const token = signToken(user);

    // Return the authentication token and the user object
    return { token, user };
  },

  // Resolver to add a new recipe
  addRecipe: async (parent, { title, ingredients, instructions }, context) => {
    // Check if a user is authenticated
    if (context.user) {
      // Create a new recipe associated with the authenticated user
      const recipe = await Recipe.create({
        title,
        ingredients,
        instructions,
        recipeAuthor: context.user.username
      });

      // Add the recipe's ID to the user's recipes array
      await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { recipes: recipe._id } }
      );

      // Return the newly created thought
      return recipe;
    }
    // Throw an error if user is not authenticated
    throw new AuthenticationError('You need to be logged in!');
  },

  // Resolver to add a new comment to a recipe
  addComment: async (parent, { recipeId, commentText }, context) => {
    // Check if a user is authenticated
    if (context.user) {
      // Add a new comment to the specified recipe
      return Recipe.findOneAndUpdate(
        { _id: recipeId },
        {
          $addToSet: {
            comments: { commentText, commentAuthor: context.user.username },
          },
        },
        {
          new: true,          // Return the modified recipe
          runValidators: true, // Run validation checks on the updated recipe
        }
      );
    }
    // Throw an error if user is not authenticated
    throw new AuthenticationError('You need to be logged in!');
  },

  // Resolver to remove a recipe
  removeRecipe: async (parent, { recipeId }, context) => {
    // Check if a user is authenticated
    if (context.user) {
      // Find and delete the specified recipe, if the authenticated user is its author
      const recipe = await Recipe.findOneAndDelete({
        _id: recipeId,
        recipeAuthor: context.user.username,
      });

      // Remove the recipe's ID from the user's thoughts array
      await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { recipes: recipe._id } }
      );

      // Return the deleted recipe
      return recipe;
    }
    // Throw an error if user is not authenticated
    throw new AuthenticationError('You need to be logged in!');
  },

  // Resolver to remove a comment from a recipe
  removeComment: async (parent, { recipeId, commentId }, context) => {
    // Check if a user is authenticated
    if (context.user) {
      // Find and update the specified thought to remove the specified comment
      return Recipe.findOneAndUpdate(
        { _id: recipeId },
        {
          $pull: {
            comments: {
              _id: commentId,
              commentAuthor: context.user.username,
            },
          },
        },
        { new: true } // Return the modified recipe
      );
    }
    // Throw an error if user is not authenticated
    throw new AuthenticationError('You need to be logged in!');
  },
},
};

module.exports = resolvers;
