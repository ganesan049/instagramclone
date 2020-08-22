"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../models/post"),
    Posts = _require.Posts;

var upload = require("../middlewares/upload");

var validator = require("../middlewares/validator");

var reqireLogin = require("../middlewares/requireLogin");

var requireLogin = require("../middlewares/requireLogin");

router.get("/allPosts", reqireLogin, function (req, res) {
  Posts.find().populate('postedBy', "_id name", 'Users').populate('comments.postedBy', "_id name", 'Users').sort("-createdAt").then(function (posts) {
    console.log(posts);
    res.json({
      posts: posts
    });
  })["catch"](function (err) {
    console.log(err);
    return res.status(400).json({
      error: err
    });
  });
});
router.get("/getSubPost", reqireLogin, function (req, res) {
  Posts.find({
    postedBy: {
      $in: req.user.following
    }
  }).populate('postedBy', "_id name", 'Users').populate('comments.postedBy', "_id name", 'Users').sort("-createdAt").then(function (posts) {
    console.log(posts);
    res.json({
      posts: posts
    });
  })["catch"](function (err) {
    console.log(err);
    return res.status(400).json({
      error: err
    });
  });
}); // router.post("/upload/img", reqireLogin, upload, validator)
// router.post("/uploadNew/img", upload, validator)

router.post("/createPost", reqireLogin, function (req, res) {
  var _req$body = req.body,
      title = _req$body.title,
      body = _req$body.body,
      url = _req$body.url;
  console.log(title, body, url, req.user, 'createpost');

  if (!title || !body || !url) {
    return res.status(422).json({
      error: "please enter all the field"
    });
  }

  req.user.password = undefined;
  console.log(req.user);
  var post = new Posts({
    title: title,
    body: body,
    photo: url,
    postedBy: req.user
  });
  post.save().then(function (result) {
    res.json({
      post: result
    });
  })["catch"](function (err) {
    console.log(err);
  });
});
router.get("/myPosts", reqireLogin, function (req, res) {
  Posts.find({
    postedBy: req.user._id
  }).populate("postedBy", "_id name", "Users").then(function (myPosts) {
    res.json({
      myPosts: myPosts
    });
  })["catch"](function (err) {
    console.log(err);
    res.status(400).json({
      message: err
    });
  });
});
router.put("/like", requireLogin, function (req, res) {
  // console.log(req.body)
  console.log(req.body, req.user);
  Posts.findByIdAndUpdate(req.body.postId, {
    $push: {
      likes: req.user._id
    },
    $pull: {
      unLikes: req.user._id
    }
  }, {
    "new": true
  }).exec(function (err, result) {
    // console.log(err)
    if (err) {
      return res.status(422).json({
        message: message
      });
    } else {
      return res.json(result);
    }
  });
});
router.put("/unlike", requireLogin, function (req, res) {
  console.log(req.body, req.user);
  Posts.findByIdAndUpdate(req.body.postId, {
    $pull: {
      likes: req.user._id
    },
    $push: {
      unLikes: req.user._id
    }
  }, {
    "new": true
  }).exec(function (err, result) {
    // console.log(err)
    if (err) {
      return res.status(422).json({
        message: message
      });
    } else {
      return res.json(result);
    }
  });
});
router.put("/comment", requireLogin, function (req, res) {
  var comments = {
    text: req.body.text,
    postedBy: req.user._id
  };
  Posts.findByIdAndUpdate(req.body.postId, {
    // $pull: {
    //     likes: req.user._id
    // },
    $push: {
      comments: comments
    }
  }, {
    "new": true
  }).populate('postedBy', "_id name", 'Users').then(function (posts) {
    console.log(posts);
    res.json({
      posts: posts
    });
  })["catch"](function (err) {
    console.log(err);
    return res.status(400).json({
      error: err
    });
  });
});
router["delete"]("/deletePost/:postId", requireLogin, function (req, res) {
  console.log('deletePost');
  Posts.findOne({
    _id: req.params.postId
  }).populate("postedBy", "_id", "Users").then(function (post) {
    console.log('post ', post);

    if (post.postedBy._id.toString() === req.user._id.toString()) {
      post.remove().then(function (result) {
        console.log('result ', result);
        return res.json({
          message: result
        });
      });
    }
  })["catch"](function (err) {
    return res.json(422).json({
      error: err
    });
  });
});
module.exports = router;