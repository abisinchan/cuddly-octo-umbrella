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
    const users = await User.create(userSeeds);

    // Create recipes and associate with users
    for (let i = 0; i < recipeSeeds.length; i++) {
      const { _id, createdBy } = await Recipe.create(recipeSeeds[i]);
      const user = await User.findOneAndUpdate(
        { username: createdBy},
        {
          $addToSet: {
            recipes: _id,
          },
        }
      );
    }
  
    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }

  process.exit(0);
});
