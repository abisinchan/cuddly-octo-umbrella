const db = require('../config/connection');
const { User, Recipe } = require('../models');
const userSeeds = require('./userSeeds.json');
const recipeSeeds = require('./recipeSeeds.json');

db.once('open', async () => {
    try {
        // Delete existing data
      await Recipe.deleteMany({});
      await User.deleteMany({});

        // Create users
      await User.create(userSeeds);
  
      //// Create recipes and associate with users
      for (let i = 0; i < recipeSeeds.length; i++) {
        const { _id, recipeAuthor } = await Recipe.create(recipeSeeds[i]);
        const user = await User.findOneAndUpdate(
          { username: recipeAuthor },
          {
            $addToSet: {
              recipes: _id,
            },
          }
        );
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  
    console.log('all done!');
    process.exit(0);
  });