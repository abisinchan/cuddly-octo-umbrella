const db = require('../config/connection');
const { User, Recipe } = require('../models');
const userSeeds = require('./userSeeds.json');
const recipeSeeds = require('./recipeSeeds.json');

db.once('open', async () => {
  try {
    // Delete existing data
    await Recipe.deleteMany({});
    await User.deleteMany({});

    // Create users and get their IDs
    const createdUsers = await User.create(userSeeds);

    // Create recipes and associate with users
    for (let i = 0; i < recipeSeeds.length; i++) {
      const recipeData = recipeSeeds[i];
      const createdByUsername = recipeData.createdBy;
      
      const user = createdUsers.find(user => user.username === createdByUsername);
      
      if (!user) {
        console.error(`User with username "${createdByUsername}" not found.`);
        continue;
      }
    
      const comments = recipeData.comments.map(comment => {
        const commentAuthorUsername = comment.commentAuthor;
        const commentAuthor = createdUsers.find(user => user.username === commentAuthorUsername);
        
        if (!commentAuthor) {
          console.error(`User with username "${commentAuthorUsername}" not found for comment.`);
          return null;
        }
        
        return {
          ...comment,
          commentAuthor: commentAuthor._id
        };
      });
    
      const newRecipe = {
        ...recipeData,
        createdBy: user._id,
        comments: comments.filter(Boolean)  // Filter out null comments
      };
    
      const recipe = await Recipe.create(newRecipe);
      
      user.recipes.push(recipe._id);  // Push the _id of the created recipe
      await user.save();  // Save the user to update the recipes array
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }

  process.exit(0);
});
