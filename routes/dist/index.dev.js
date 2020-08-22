"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../models/user"),
    Users = _require.Users;

var bcrypt = require("bcryptjs");

var crypto = require("crypto");

var jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer");

var sendgridTransport = require("nodemailer-sendgrid-transport");

var transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.EMAIL_KEY
  }
}));
router.post("/signup", function (req, res) {
  try {
    var _req$body = req.body,
        name = _req$body.name,
        email = _req$body.email,
        password = _req$body.password,
        url = _req$body.url;

    if (!name || !email || !password) {
      console.log("all fields are mandatory");
      var err = new Error("All Fields are mandatory");
      return res.status(400).json({
        message: err.message
      });
    }

    Users.findOne({
      email: email
    }).then(function (userExist) {
      if (userExist) {
        return res.status(401).json({
          message: "Users is already found please sign in"
        });
      }

      bcrypt.hash(password, 12).then(function (hashPwd) {
        var user = new Users({
          name: name,
          email: email,
          password: hashPwd,
          url: url
        });
        user.save().then(function (userSaved) {
          console.log(userSaved);
          transporter.sendMail({
            to: userSaved.email,
            from: "ganesanece49@gmail.com",
            subject: "From InstaClone",
            text: "".concat(userSaved.name, " saved successfully contine sing in"),
            html: "<strong>and easy to do anywhere, even with Node.js</strong>"
          });
          res.status(200).json({
            message: "".concat(userSaved.name, " saved successfully contine sing in")
          });
        })["catch"](function (err) {
          console.log(err);
          return res.status(400).json({
            error: "error exists while saving the user ".concat(err)
          });
        });
      })["catch"](function (err) {
        console.log(err);
      });
    })["catch"](function (err) {
      console.log(err);
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "error occured ".concat(error)
    });
  }
});
router.post("/signin", function (req, res) {
  console.log(req.body);
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;

  if (!email || !password) {
    return res.status(400).json({
      message: "All Fields are mandatory"
    });
  }

  Users.findOne({
    email: email
  }).then(function (user) {
    if (!user) {
      return res.status(400).json({
        message: "Invalid email Id or password"
      });
    }

    bcrypt.compare(password, user.password).then(function (doMatch) {
      if (!doMatch) {
        return res.status(400).json({
          message: "Invalid email Id or password"
        });
      } else {
        var token = jwt.sign({
          _id: user._id
        }, process.env.JWT_SECRETKEY);
        var _email = user.email,
            followers = user.followers,
            following = user.following,
            name = user.name,
            url = user.url,
            _id = user._id;
        res.json({
          token: token,
          user: {
            email: _email,
            followers: followers,
            following: following,
            name: name,
            url: url,
            _id: _id
          }
        });
      }
    })["catch"](function (err) {
      console.log(err);
    });
  });
});
router.post("/resetPassword", function (req, res) {
  var path = "http://localhost:3000";

  if (process.env.NODE_ENV === "production") {
    path = "https://instaclone049.herokuapp.com";
  }

  crypto.randomBytes(32, function (err, buffer) {
    if (err) console.log(err);
    var token = buffer.toString("hex");
    console.log(req.body);
    Users.findOne({
      email: req.body.email
    }).then(function (user) {
      if (!user) {
        return res.status(422).json({
          message: "User dont exist with ".concat(req.body.email, " email")
        });
      }

      console.log(user);
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then(function (result) {
        transporter.sendMail({
          to: user.email,
          from: 'ganesanece49@gmail.com',
          subject: "Reset Password",
          html: "\n          <p>You requested for password reset</p>\n          <h5>click in This <a href=\"".concat(path, "/reset/").concat(token, "\">Link</a></h5>\n          ")
        }).then(function (output) {
          return console.log(output);
        });
        res.json({
          message: "check your mail"
        });
      });
    });
  });
});
router.put("/reset/:token", function (req, res) {
  var sentToken = req.params.token;
  var newPassword = req.body.password;
  Users.findOne({
    resetToken: sentToken,
    expireToken: {
      $gt: Date.now()
    }
  }).then(function (user) {
    if (!user) {
      return res.status(422).json({
        message: "Try again session expired"
      });
    }

    console.log(newPassword);
    bcrypt.hash(newPassword, 12).then(function (hashedPwd) {
      user.password = hashedPwd;
      user.resetToken = undefined;
      user.expireToken = undefined;
      user.save().then(function (savedUser) {
        res.json({
          message: "pwd reset successfully",
          savedUser: savedUser
        });
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
});
module.exports = router;