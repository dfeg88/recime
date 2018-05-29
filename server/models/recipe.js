const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  _userID: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  recipeName: {
    required: true,
    type: String,
    maxlength: 60,
    minlength: 1
  },
  category: {
    required: true,
    type: String,
  },
  servings: {
    required: true,
    type: Number
  },
  cuisine: {
    required: true,
    type: String
  },
  prepTime: {
    type: Number
  },
  cookingTime: {
    type: Number
  },
  instructions: {
    type: String,
    maxlength: 5000
  },
  ingredients: [{
    ingredientName: {
      type: String
    },
    quantity: {
      type: Number
    },
    measurement: {
      type: String
    }
  }]
});

RecipeSchema.methods.reduceIngredients = function(recipe, callback) {
	recipe.ingredients = recipe.ingredients.reduce((acc, el) => {
		const existEl = acc.find(e => e.ingredientName == el.ingredientName && e.measurement == el.measurement);
		if (existEl) {
			existEl.quantity = existEl.quantity + el.quantity;
		} else {
			acc.push(el);
		}

		return acc;
	}, []);

	callback();
}

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = {Recipe};
