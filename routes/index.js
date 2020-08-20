const express = require("express");
const router = express.Router();
const {
  Users
} = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.EMAIL_KEY,
    },
  })
);

router.post("/signup", (req, res) => {
  try {
    const {
      name,
      email,
      password,
      url
    } = req.body;
    if (!name || !email || !password) {
      console.log("all fields are mandatory");
      let err = new Error("All Fields are mandatory");
      return res.status(400).json({
        message: err.message,
      });
    }
    Users.findOne({
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
              url,
            });
            user
              .save()
              .then((userSaved) => {
                console.log(userSaved);
                transporter.sendMail({
                  to: userSaved.email,
                  from: "ganesanece49@gmail.com",
                  subject: "From InstaClone",
                  text: `${userSaved.name} saved successfully contine sing in`,
                  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
                });
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
  Users.findOne({
    email,
  }).then((user) => {
    if (!user) {
      return res.status(400).json({
        message: "Invalid email Id or password",
      });
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (!doMatch) {
          return res.status(400).json({
            message: "Invalid email Id or password",
          });
        } else {
          const token = jwt.sign({
              _id: user._id,
            },
            process.env.JWT_SECRETKEY
          );
          const {
            email,
            followers,
            following,
            name,
            url,
            _id
          } = user;
          res.json({
            token,
            user: {
              email,
              followers,
              following,
              name,
              url,
              _id,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/resetPassword", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) console.log(err);
    const token = buffer.toString("hex");
    console.log(req.body)
    Users.findOne({
        email: req.body.email
      })
      .then(user => {
        if (!user) {
          return res.status(422).json({
            message: `User dont exist with ${req.body.email} email`
          })
        }
        console.log(user)
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.save().then(result => {
          transporter.sendMail({
            to: user.email,
            from: 'ganesanece49@gmail.com',
            subject: "Reset Password",
            html: `
          <p>You requested for password reset</p>
          <h5>click in This <a href="http://localhost:3000/reset/${token}">Link</a></h5>
          `
          }).then(output => console.log(output))
          res.json({
            message: "check your mail"
          })
        })
      })
  });
});

router.put("/reset/:token", (req, res) => {
  const sentToken = req.params.token;
  const newPassword = req.body.password;
  Users.findOne({
    resetToken: sentToken,
    expireToken: {
      $gt: Date.now()
    }
  }).then(user => {
    if (!user) {
      return res.status(422).json({
        message: "Try again session expired"
      })
    }
    console.log(newPassword)
    bcrypt.hash(newPassword, 12)
      .then(hashedPwd => {
        user.password = hashedPwd
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then(savedUser => {
          res.json({
            message: "pwd reset successfully",
            savedUser
          })
        })
      })
      .catch(err => console.log(err))
  }).catch(err => console.log(err))
})

module.exports = router;