require("./../config/config");

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');

const { User } = require("./../models/user");
const { Recipe } = require("./../models/recipe");
const { mongoose } = require("./../db/mongoose");

const router = express.Router();

// POST /recipe
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const body = {
      recipeName: req.body.recipeName,
      category: req.body.category,
      servings: req.body.serving,
      cuisine: req.body.cuisine,
      ingredients: req.body.ingredients,
      prepTime: req.body.prepTime,
      cookingTime: req.body.cookingTime,
      instructions: req.body.instructions,
      _userID: req.user._id
    };

    let recipe = new Recipe(body);

    recipe.reduceIngredients(recipe, () => {
      recipe
        .save()
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Recipe created successfully",
            recipe: recipe
          });
        })
        .catch(e => {
          res.status(404).json({
            success: false,
            message: "Recipe unable to save",
            error: e
          });
        });
    });
  }
);

// GET /recipes (All recipes for an individual user)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Recipe.find({
      _userID: req.user._id
    }).then(
      recipes => {
        res.status(200).json({
          success: true,
          recipes: recipes,
          message: "Loaded recipes"
        });
      },
      e => {
        res.status(400).json({
          success: false,
          error: e,
          message: "Unable to load recipes"
        });
      }
    );
  }
);

// GET /recipe (By ID for a given user)
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log(`Params: ${req.params.id}`);
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Recipe.findOne({
      _id: id,
      _userID: req.user._id
    })
      .then(recipe => {
        if (!recipe) {
          return res.status(404).json({
            success: false,
            error: e,
            message: "Unable to find recipe"
          });
        }

        res.json({
          success: true,
          recipe: recipe
        });
      })
      .catch(e => {
        res.status(400).send();
      });
  }
);

// DELETE /recipe by ID
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Recipe.findOneAndRemove({
      _id: id,
      _userID: req.user._id
    })
      .then(recipe => {
        if (!recipe) {
          return res.status(404).send();
        }

        res.json({
          recipe: recipe,
          success: true
        });
      })
      .catch(e => {
        res.status(400).send();
      });
  }
);

// Update /recipe by ID
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    let id = req.body.id;
    let body = _.pick(req.body, [
      "recipeName",
      "category",
      "servings",
      "cuisine",
      "prepTime",
      "cookingTime",
      "instructions",
      "ingredients"
    ]);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Recipe.findOneAndUpdate(
      {
        _id: id,
        _userID: req.user._id
      },
      { $set: body },
      { new: true },
    )
      .then(recipe => {
        if (!recipe) {
          return res.status(404).send();
        }

        res.status(200).json({
          recipe: recipe,
          success: true
        });
      })
      .catch(e => {
        res.status(400).send();
      });
  }
);

router.get('/import/*', passport.authenticate("jwt", {session:false}), (req,res,next) => {

  let url = req.params[0];

  axios.get(url)
    .then((response) => {

      const recipeDetails = {
        recipeName: '',
        category: '',
        servings: '',
        cuisine: '',
        ingredients: [],
        prepTime: '',
        cookingTime: '',
        instructions: ''
      };

      const $ = cheerio.load(response.data);

      // recipe name
      recipeDetails.recipeName = $('.recipe-header__title').text();

      //category
      const importedCategory = $('meta[itemprop=recipeCategory]').attr('content');

      if (['Breakfast', 'Lunch', 'Dinner', 'Snack'].indexOf(importedCategory)> -1) {
        recipeDetails.category = importedCategory;
      }

      // servings
      let serving = $('.recipe-details__item--servings .recipe-details__text').text();
      let servingNumber = serving.replace(/\D/g, '');
      recipeDetails.serving = servingNumber;

      // ingredients
      $('.ingredients-list__group li').not('div').each(function(i) {
        //init ingredient object to push to recipeDetails.ingredients array
        let importedIngredient = {
          ingredientName: '',
          quantity: '',
          measurement: ''
        };

        // remove article text that is nested within ingredients list
        let ingredientMarkup = $(this).clone();
        ingredientMarkup.find('article').remove();
        let ingredientText = ingredientMarkup.text();

        // remove all non-numeric digits in string to get quantity
        if (ingredientText.indexOf('¼') > -1) {
          importedIngredient.quantity = 0.25;
        } else if (ingredientText.indexOf('½') > -1) {
          importedIngredient.quantity = 0.5;
        } else {
          importedIngredient.quantity = ingredientText.replace(/\D/g, '');
        }

        // WIP - get ingredient name
        let importedIngredientName = ingredientText.replace(/[0-9]/g, '');
        importedIngredientName = importedIngredientName.replace(/ *\b\S*?tsp\s|tbsp\s|pack\s|cup\s|ml\s|small\s|medium\s|large\s|kg\S*\b/g, '');
        importedIngredientName = importedIngredientName.replace(/^g\s/, '');
        importedIngredientName = importedIngredientName.replace('¼', '');

        importedIngredient.ingredientName = importedIngredientName.trim();

        // hack away at text to get measurement type
        let splitText = ingredientText.replace(/[0-9]/g, '');
        splitText = splitText.replace(/[^0-9a-z-A-Z ]/g, '').trim().split(" ");
        let measurements = ['tsp', 'tbsp', 'cup', 'ml', 'g', 'small', 'medium', 'large', 'kg', 'bunch', 'pack'];
        let importedMeasurement = splitText[0];

        // compare measurement from imported ingredient to list of measurements used by splitText
        // if match, set value
        if ((measurements.indexOf(importedMeasurement) > -1)) {
          importedIngredient.measurement = importedMeasurement;
        }
        recipeDetails.ingredients.push(importedIngredient);
      });

      // prep time
      let prepTime = $('.recipe-details__cooking-time-prep > span').text();
      let prepTimeNumber = prepTime.replace(/\D/g, '');
      recipeDetails.prepTime = prepTimeNumber;

      // cooking time
      let cookingTime = $('.recipe-details__cooking-time-cook > span').text();
      let cookingTimeNumber = cookingTime.replace(/\D/g, '');
      recipeDetails.cookingTime = cookingTimeNumber;

      //instructions
      let instructions = [];
      $('.method__list li').each(function(index) {
        instructions.push($(this).text());
        instructions.push('\n\n');
      })

      recipeDetails.instructions = instructions.join("");

      return res.json({
        success: true,
        recipeDetails: recipeDetails
      });
    })
    .catch((error) => {
      console.log(error);
    });

});

module.exports = router;
