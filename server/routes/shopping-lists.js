require("./../config/config");

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { mongoose } = require("./../db/mongoose");

const { User } = require("./../models/user");
const { Recipe } = require("./../models/recipe");
const { ShoppingList } = require("./../models/shopping-list");

const router = express.Router();

// POST /shopping-list
router.post("/", passport.authenticate("jwt", {session:false}), (req, res, next) => {
  let body = {
    _userID: req.user._id,
    shoppingListName: req.body.shoppingListName,
    ingredients: req.body.ingredients
  };

  let shoppingList = new ShoppingList(body);

  shoppingList.save()
    .then(() => {
      res.status(200).json({
        success: true,
        message: "shoppingList created successfully",
        shoppingList: shoppingList
      });
    })
    .catch(e => {
      res.status(404).json({
        success: false,
        message: "shoppingList unable to save",
        error: "Error"
      });
    });    
});

// GET /shopping-lists
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    ShoppingList.find({
      _userID: req.user._id
    }).then(
      shoppingLists => {
        res.status(200).json({
          success: true,
          shoppingLists: shoppingLists,
          message: "Loaded shoppingLists"
        });
      },
      e => {
        res.status(400).json({
          success: false,
          error: e,
          message: "Unable to load shoppingLists"
        });
      }
    );
  }
);

// GET /shopping-list/:id
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log(`Params: ${req.params.id}`);
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    ShoppingList.findOne({
      _id: id,
      _userID: req.user._id
    })
      .then(shoppingList => {
        if (!shoppingList) {
          return res.status(404).json({
            success: false,
            error: e,
            message: "Unable to find shoppingList"
          });
        }

        res.json({
          success: true,
          shoppingList: shoppingList
        });
      })
      .catch(e => {
        res.status(400).send();
      });
  }
);

// DELETE /shopping-list/:id
router.delete('/:id', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  ShoppingList.findOneAndRemove({
    _id: id,
    _userID: req.user._id
  })
  .then(shoppingList => {
    if (!shoppingList) {
      return res.status(404).json({
        success: false
      });
    }

    res.status(200).json({
      shoppingList: shoppingList,
      success: true
    });
  })
  .catch(e => {
    res.status(404).json({
      success: false
    })
  })
});

// UPDATE /recipe/:id

module.exports = router;
