const express = require("express");
const router = express.Router();
const {
    Posts
} = require("../models/post");
const upload = require("../middlewares/upload")
const validator = require("../middlewares/validator")
const reqireLogin = require("../middlewares/requireLogin");
const requireLogin = require("../middlewares/requireLogin");

router.get("/allPosts", reqireLogin, (req, res) => {
    Posts.find()
        .populate('postedBy', "_id name", 'Users')
        .populate('comments.postedBy', "_id name", 'Users')
        .then(posts => {
            console.log(posts)
            res.json({
                posts
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({
                error: err
            })
        })
})
router.get("/getSubPost", reqireLogin, (req, res) => {
    Posts.find({
            postedBy: {
                $in: req.user.following
            }
        })
        .populate('postedBy', "_id name", 'Users')
        .populate('comments.postedBy', "_id name", 'Users')
        .then(posts => {
            console.log(posts)
            res.json({
                posts
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({
                error: err
            })
        })
})

router.post("/upload/img", reqireLogin, upload, validator)
router.post("/uploadNew/img", upload, validator)

router.post("/createPost", reqireLogin, (req, res) => {
    const {
        title,
        body,
        url
    } = req.body;
    console.log(title, body, url, req.user, 'createpost')
    if (!title || !body || !url) {
        return res.status(422).json({
            error: "please enter all the field"
        })
    }
    req.user.password = undefined;
    console.log(req.user)
    const post = new Posts({
        title,
        body,
        photo: url,
        postedBy: req.user
    })
    post.save().then(result => {
            res.json({
                post: result
            })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get("/myPosts", reqireLogin, (req, res) => {
    Posts.find({
            postedBy: req.user._id
        })
        .populate("postedBy", "_id name", "Users")
        .then(myPosts => {
            res.json({
                myPosts
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                message: err
            })
        })
})

router.put("/like", requireLogin, (req, res) => {
    // console.log(req.body)
    console.log(req.body, req.user)
    Posts.findByIdAndUpdate(req.body.postId, {
        $push: {
            likes: req.user._id
        },
        $pull: {
            unLikes: req.user._id
        }
    }, {
        new: true
    }).exec((err, result) => {
        // console.log(err)
        if (err) {
            return res.status(422).json({
                message
            })
        } else {
            return res.json(result)
        }
    })
})
router.put("/unlike", requireLogin, (req, res) => {
    console.log(req.body, req.user)
    Posts.findByIdAndUpdate(req.body.postId, {
        $pull: {
            likes: req.user._id
        },
        $push: {
            unLikes: req.user._id
        }
    }, {
        new: true
    }).exec((err, result) => {
        // console.log(err)
        if (err) {
            return res.status(422).json({
                message
            })
        } else {
            return res.json(result)
        }
    })
})
router.put("/comment", requireLogin, (req, res) => {
    const comments = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Posts.findByIdAndUpdate(req.body.postId, {
            // $pull: {
            //     likes: req.user._id
            // },
            $push: {
                comments
            }
        }, {
            new: true
        })
        .populate('postedBy', "_id name", 'Users')
        .then(posts => {
            console.log(posts)
            res.json({
                posts
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({
                error: err
            })
        })
})

router.delete("/deletePost/:postId", requireLogin, (req, res) => {
    console.log('deletePost')
    Posts.findOne({
            _id: req.params.postId
        })
        .populate("postedBy", "_id", "Users")
        .then(post => {
            console.log('post ', post)
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        console.log('result ', result)
                        return res.json({
                            message: result
                        })
                    })
            }
        })
        .catch(err => {
            return res.json(422).json({
                error: err
            })
        })
})
module.exports = router