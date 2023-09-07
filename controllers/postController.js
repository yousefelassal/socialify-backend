const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().populate('user').sort({ createdAt: 'desc' });
    res.json(posts);
});

exports.create = [
    body('content').trim().isLength({ min: 1 }).escape().withMessage('Post content must be specified.'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const { content } = req.body;
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ error: 'token invalid' });
        }
        const user = await User.findById(decodedToken.id);
        const post = new Post({
            content,
            user: user._id
        });
        const savedPost = await post.save();
        user.posts = user.posts.concat(savedPost._id);
        await user.save();
        res.status(201).json(savedPost);
    })
]

exports.update = [
    body('content').trim().isLength({ min: 1 }).escape().withMessage('Post content must be specified.'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const { content } = req.body;
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ error: 'token invalid' });
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'post not found' });
        }
        if (post.user.toString() !== decodedToken.id) {
            return res.status(401).json({ error: 'token invalid' });
        }
        post.content = content;
        const savedPost = await post.save();
        res.status(200).json(savedPost);
    })
]

exports.delete = asyncHandler(async (req, res, next) => {
    await Post.findByIdAndRemove(req.params.id);
    res.status(204).end();
});