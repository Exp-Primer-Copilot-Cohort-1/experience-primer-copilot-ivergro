// Create web server

//Skrev kun en kommentar, trykket ctr + shift, fikk 10 muligheter

// Import express
const express = require('express');

// Import express router
const router = express.Router();

// Import mongoose
const mongoose = require('mongoose');

// Import body-parser
const bodyParser = require('body-parser');

// Import jsonwebtoken
const jwt = require('jsonwebtoken');

// Import config
const config = require('../config/config.json');

// Import model
const Comment = require('../models/comment');

// Import model
const User = require('../models/user');

// Import model
const Post = require('../models/post');

// Import model
const Like = require('../models/like');

// Import model
const Dislike = require('../models/dislike');

// Import middleware
const checkAuth = require('../middleware/check-auth');

// Create route for adding a new comment
router.post('/', checkAuth, (req, res, next) => {
    // Create new comment
    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        post: req.body.post,
        user: req.body.user,
        text: req.body.text,
        date: req.body.date
    });

    // Save comment
    comment.save().then(result => {
        // Find the post the comment belongs to
        Post.findById(req.body.post).exec().then(post => {
            // Add comment to post
            post.comments.push(comment);
            // Save post
            post.save().then(result => {
                // Find the user the comment belongs to
                User.findById(req.body.user).exec().then(user => {
                    // Add comment to user
                    user.comments.push(comment);
                    // Save user
                    user.save().then(result => {
                        // Return success message
                        res.status(201).json({
                            message: 'Comment saved successfully',
                            comment: comment
                        });
                    }).catch(err => {
                        // Return error message
                        res.status(500).json({
                            error: err
                        });
                    });
                }).catch(err => {
                    // Return error message
                    res.status(500).json({
                        error: err
                    });
                });
            }).catch(err => {
                // Return error message
                res.status(500).json({
                    error: err
                });
            });
        }).catch(err => {
            // Return error message
            res.status(500).json({
                error: err
            });
        });
    }).catch(err => {
        // Return error message
        res.status(500).json