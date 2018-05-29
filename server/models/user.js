require('./../config/config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

UserSchema.statics.getUserById = function(id, callback){
  User.findById(id, callback);
}

UserSchema.statics.getUserByEmail = function(email, callback){
  const query = {email: email}
  User.findOne(query, callback);
}

UserSchema.statics.addUser = function(newUser, callback){
	var salt = bcrypt.genSalt(10);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

UserSchema.statics.comparePassword = function (candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) {
			return callback(err, false);
		}
    return callback(null, isMatch);
  });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};
