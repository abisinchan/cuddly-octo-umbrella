const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
      trim: true,
    },

    ingredients: [
      {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
    ],

    instructions: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
    createdBy: {
      type: Schema.Types.ObjectId, //reference a User here
      ref: 'User', //
      required: true,
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
          type: Schema.Types.ObjectId, // reference a User here
          ref: 'User', // 
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          get: (createdAt) => dateFormat(createdAt), // Use dateFormat function
        },
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

recipeSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;
