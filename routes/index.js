const express = require("express");
const router = express.Router();
const {
  Users
} = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

router.post("/signup", (req, res) => {
  try {
    const {
      name,
      email,
      password,
      url
    } = req.body;
    if (!name || !email || !password) {
      console.log('all fields are mandatory')
      let err = new Error("All Fields are mandatory")
      return res.status(400).json({
        message: err.message
      });
    }
    Users
      .findOne({
        email,
      })
      .then((userExist) => {
        if (userExist) {
          return res.status(401).json({
            message: "Users is already found please sign in",
          });
        }
        bcrypt
          .hash(password, 12)
          .then((hashPwd) => {
            const user = new Users({
              name,
              email,
              password: hashPwd,
              url
            });
            user
              .save()
              .then((userSaved) => {
                res.status(200).json({
                  message: `${userSaved.name} saved successfully contine sing in`,
                });
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json({
                  error: `error exists while saving the user ${err}`,
                });
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: `error occured ${error}`,
    });
  }
});

router.post("/signin", (req, res) => {
  console.log(req.body);
  const {
    email,
    password
  } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "All Fields are mandatory",
    });
  }
  Users
    .findOne({
      email,
    })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          message: "Invalid email Id or password"
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            return res
              .status(400)
              .json({
                message: "Invalid email Id or password"
              });
          } else {
            const token = jwt.sign({
              _id: user._id
            }, process.env.JWT_SECRETKEY)
            const {
              email,
              followers,
              following,
              name,
              url,
              _id
            } = user
            res.json({
              token,
              user: {
                email,
                followers,
                following,
                name,
                url,
                _id
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

module.exports = router;