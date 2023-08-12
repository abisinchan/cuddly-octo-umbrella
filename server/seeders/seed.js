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
      const recipeSeed = recipeSeeds[i];
      const user = users.find(user => user.username === recipeSeed.createdBy.username);

      if (user) {
        const recipe = await Recipe.create({
          title: recipeSeed.title,
          ingredients: recipeSeed.ingredients,
          instructions: recipeSeed.instructions,
          createdBy: user.username,
          createdAt: recipeSeed.createdAt,
          comments: recipeSeed.comments
        });

        user.recipes.push(recipe);
        await user.save();

        console.log(`Associated recipe "${recipeSeed.title}" with user "${user.username}"`);
      }
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }

  process.exit(0);
});
