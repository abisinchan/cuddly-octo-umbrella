const { AuthenticationError } = require('apollo-server-express');
const { User, Recipe} = require('../models'); 
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // View all users and their recipes
    users: async () => {
      const users = await User.find().populate({
        path: 'recipes',
        populate: {
          path: 'comments.commentAuthor',
          model: 'User',
        },
      });
    
      return users.map(user => ({
        ...user.toObject(),
        recipes: user.recipes.map(recipe => ({
          ...recipe.toObject(),
          createdAt: recipe.createdAt.toString(),
          createdBy: {
            _id: user._id,
            username: user.username,
          },
          comments: recipe.comments.map(comment => ({
            ...comment.toObject(),
            commentAuthor: {
              _id: comment.commentAuthor._id,
              username: comment.commentAuthor.username,
            },
            createdAt: comment.createdAt.toString(),
          })),
        })),
      }));
    },
  

    // View a user and their recipes
    user: async (parent, { userId }) => {
      const user = await User.findById(userId).populate({
        path: 'recipes',
        populate: {
          path: 'comments.commentAuthor',
          model: 'User',
        },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return {
        ...user.toObject(),
        recipes: user.recipes.map(recipe => ({
          ...recipe.toObject(),

          createdAt: recipe.createdAt.toString(),

          createdBy: {
            _id: user._id,
            username: user.username || '', // Provide a default value if username is null
          },
          comments: recipe.comments.map(comment => ({
            ...comment.toObject(),
            commentAuthor: comment.commentAuthor
              ? {
                  _id: comment.commentAuthor._id || '',
                  username: comment.commentAuthor.username || '',
                }
              : null,
              createdAt: comment.createdAt.toString(),
          })),
        })),
      };
    },

    // View all recipes in descending order by creation date
    recipes: async () => {
      const recipes = await Recipe.find().populate([
        { path: 'createdBy', model: 'User' },
        { path: 'comments.commentAuthor', model: 'User' },
      ]).sort({ createdAt: -1 });
    
      return recipes.map(recipe => ({
        ...recipe.toObject(),

        createdAt: recipe.createdAt.toString(),

        createdBy: {
          _id: recipe.createdBy._id,
          username: recipe.createdBy.username,
        },
        comments: recipe.comments.map(comment => ({
          ...comment.toObject(),
          commentAuthor: {
            _id: comment.commentAuthor._id,
            username: comment.commentAuthor.username,
          },
          createdAt: comment.createdAt.toString(),
        })),
      }));
    },

    // View a recipe and its comments
    recipe: async (parent, { recipeId }) => {
      const recipe = await Recipe.findById(recipeId).populate([
        { path: 'createdBy', model: 'User' },
        { path: 'comments.commentAuthor', model: 'User' },
      ]);
    
      if (!recipe) {
        throw new Error("Recipe not found");
      }
    
      return {
        ...recipe.toObject(),
        createdAt: recipe.createdAt.toString(),
      
        createdBy: {
          _id: recipe.createdBy._id,
          username: recipe.createdBy.username,
        },
    
        comments: recipe.comments.map(comment => ({
          ...comment.toObject(),
          commentAuthor: {
            _id: comment.commentAuthor._id,
            username: comment.commentAuthor.username,
          },
          createdAt: comment.createdAt.toString(),
         
        })),
      };
    },
 
    // View only recipes created by the logged-in user
    myRecipes: async (parent, { userId }) => {
      try {
        // Fetch the user by _id
        const user = await User.findById(userId).populate({
          path: 'recipes',
          populate: {
            path: 'comments.commentAuthor',
            model: 'User',
          },
        });

        if (!user) {
          throw new Error('User not found');
        }

        // Transform the recipes and populate relevant data
        const transformedRecipes = user.recipes.map(recipe => ({
          ...recipe.toObject(),
          createdAt: recipe.createdAt.toString(),
          createdBy: {
            _id: user._id,
            username: user.username,
          },
          comments: recipe.comments.map(comment => ({
            ...comment.toObject(),
            commentAuthor: {
              _id: comment.commentAuthor._id,
              username: comment.commentAuthor.username,
              createdAt: comment.createdAt.toString(),
            },
          })),
        }));

        return transformedRecipes;
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching recipes by user ID');
      }
    },
  },
  
  Mutation: {
    // Add a user
 // Sign up and return token
 addUser: async (parent, { username, email, password }) => {
  const newUser = new User({ username, email, password });
  const savedUser = await newUser.save();

  const token = signToken(savedUser);
  return { token, user: savedUser };
},

// Login and return token
login: async (parent, { username, password }) => {
  // Find a user in the database using the provided email
  const user = await User.findOne({ username});

  // If no user is found with the provided email, throw an error
  if (!user) {
    throw new AuthenticationError('No user found with this username');
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

     // Add a recipe (authenticated)
     addRecipe: async (parent, { title, ingredients, instructions }, context) => {
      if (context.user) {
        // Fetch the authenticated user's username
        const user = await User.findById(context.user._id);
    
        // Create a new recipe associated with the authenticated user's _id
        const recipe = await Recipe.create({
          title,
          ingredients,
          instructions,
          createdBy: user._id,
        });
    
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { recipes: recipe._id } }
        );
    
        // Manually construct the recipe object with the username field
        const populatedRecipe = {
          ...recipe.toObject(),
          createdBy: {
            _id: user._id,
            username: user.username,
          },
        };
    
        return populatedRecipe;
      }
    
      throw new Error("Authentication required to add a recipe.");
    },
    
// Resolver to add a new comment to a recipe
addComment: async (parent, { recipeId, commentText }, context) => {
  if (context.user) {
    try {
      const user = await User.findById(context.user._id);

      const comment = {
        commentText,
        commentAuthor: {
          _id: user._id,
          username: user.username,
        },
      };

      const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        {
          $addToSet: { comments: comment },
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate({
        path: 'comments.commentAuthor',
        model: 'User',
        select: 'username',
      }).exec();

      return updatedRecipe;
    } catch (error) {
      console.error(error);
      throw new Error('Error adding comment');
    }
  }

  throw new AuthenticationError('You need to be logged in!');
},

    // Remove a recipe (authenticated)
   removeRecipe: async (parent, { recipeId }, context) => {
    // Check if a user is authenticated
    if (context.user) {
      // Find and delete the specified recipe, if the authenticated user is its author
      const recipe = await Recipe.findOneAndDelete({
        _id: recipeId,
       // createdBy: context.user.username,
      });

      // Remove the recipe's ID from the user's recipes array
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

// Remove a comment (authenticated)
removeComment: async (parent, { recipeId, commentId }, context) => {
  // Check if a user is authenticated
  if (context.user) {
    try {
      // Find and update the specified recipe to remove the specified comment
      const updatedRecipe = await Recipe.findOneAndUpdate(
        {
          _id: recipeId,
          'comments._id': commentId,
          'comments.commentAuthor': context.user._id,
        },
        {
          $pull: {
            comments: {
              _id: commentId,
              commentAuthor: context.user._id,
            },
          },
        },
        { new: true }
      ).populate({
        path: 'comments.commentAuthor',
        model: 'User',
        select: 'username',
      }).exec();

      if (!updatedRecipe) {
        throw new Error('Recipe or comment not found');
      }

      return updatedRecipe;
    } catch (error) {
      console.error(error);
      throw new Error('Error removing comment');
    }
  }

  // Throw an error if user is not authenticated
  throw new AuthenticationError('You need to be logged in!');
},

// Save a recipe (authenticated)
saveRecipe: async (parent, { recipeId }, context) => {
  try {
  if (context.user) {
    // Fetch the authenticated user
    const user = await User.findById(context.user._id);

    // Update the user's savedRecipes array
    await User.findByIdAndUpdate(
    context.user._id,
    { $addToSet: { savedRecipes: recipeId } },
    { new: true }
      );

    // Return the updated user
    return user;
      }
    throw new AuthenticationError('You need to be logged in to save a recipe.');
    } catch (error) {
    console.error(error);
    throw new Error('Error saving recipe');
    }
    },
  },
};

module.exports = resolvers;