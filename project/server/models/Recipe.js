const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },

    ingredients: [{ 
      type: String, 
      required: true, 
      minlength: 1,
      maxlength: 280 
    }],

    instructions: { 
      type: String, 
      required: true, 
      minlength: 1,
      maxlength: 1000
    },

    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },

    comments: [
      {
        commentText: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 280,
        },
        commentAuthor: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          get: (timestamp) => dateFormat(timestamp),
        },
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;
