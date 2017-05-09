var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

// Register
router.post('/register', function (req, res, next) {
  // cria novo objecto user com os valores que vêm do form
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  // adiciona o user
  User.addUser(newUser, function (err, user) {
    if (err) {
      res.json({
        success: false,
        msg: 'Utilizador não registado'
      });
    } else {
      res.json({
        success: true,
        msg: 'Utilizador registado'
      });
    }
  })
});

// Authenticate
router.post('/authenticate', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.getUserByUsername(username, function (err, user) {
    if (err) {
      throw err;
    }
    if (!user) {
      return res.json({
        success: false,
        msg: 'User not found'
      });
    }

    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) {
        throw err;
      }
      if (isMatch) {
        var token = jwt.sign(user, config.secret, {
          expiresIn: 604800 //1 semana em segundos
        });
        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({
          success: false,
          msg: 'Wrong password'
        });
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), function (req, res, next) {
  res.json({user:req.user});
});


module.exports = router;