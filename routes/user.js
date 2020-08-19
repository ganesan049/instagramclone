const express = require("express");
const router = express.Router();
const {
    Users
} = require("../models/user");
const {
    Posts
} = require("../models/post");
const upload = require("../middlewares/upload")
const validator = require("../middlewares/validator")
const requireLogin = require("../middlewares/requireLogin");

router.get('/user/:id', requireLogin, (req, res) => {
    Users.findById(req.params.id)
        .select("-password")
        .then(user => {
            Posts.find({
                    postedBy: req.params.id
                })
                .populate("postedBy", "_id name", "Users")
                .then(post => {
                    // console.log('inside /user/:id', post, user)
                    return res.json({
                        post,
                        user
                    })
                }).catch(err => {
                    return res.status(401).json({
                        message: err
                    })
                })
        })
        .catch(err => {
            return res.status(401).json({
                message: err
            })
        })
})

router.put('/follow/:id', requireLogin, (req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        $push: {
            followers: req.user._id
        }
    }, {
        new: true
    }, (err, dummyUser) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        }
        Users.findByIdAndUpdate(req.user._id, {
                $push: {
                    following: req.params.id
                }
            }, {
                new: true
            })
            .select("-password")
            .then(mainUser => {
                res.json({
                    mainUser,
                    dummyUser
                })
            })
            .catch(err => {
                res.status(400).json({
                    error: err
                })
            })
    })
})
router.put('/updateImg', requireLogin, (req, res) => {
    console.log(req.body.url)
    Users.findByIdAndUpdate(req.user._id, {
        $set: {
            url: req.body.url
        }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            result
        })
    })
})

router.put('/unFollow/:id', requireLogin, (req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        $pull: {
            followers: req.user._id
        }
    }, {
        new: true
    }, (err, dummyUser) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        }
        Users.findByIdAndUpdate(req.user._id, {
                $pull: {
                    following: req.params.id
                }
            }, {
                new: true
            })
            .select("-password")
            .then(mainUser => {
                res.json({
                    mainUser,
                    dummyUser
                })
            })
            .catch(err => {
                res.status(400).json({
                    error: err
                })
            })
    })
})

module.exports = router