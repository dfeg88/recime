const mongoose = require('mongoose');

var ShoppingListSchema = new mongoose.Schema({
  _userID: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  shoppingListName: {
    type: String,
    required: true
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

const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);

module.exports = {ShoppingList};
