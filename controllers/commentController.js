const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const getTokenFrom = req => {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
}

exports.create = asyncHandler(async (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const post = await Post.findById(req.params.id);
    const user = await User.findById(decodedToken.id);

    const comment = new Comment({
        content: req.body.content,
        user: user._id,
        post: post._id
    });

    const savedComment = await comment.save();
    post.comments = post.comments.concat(savedComment._id);
    user.comments = user.comments.concat(savedComment._id);
    await post.save();
    await user.save();
    res.status(201).json(savedComment);
});

exports.update = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodedToken.id || comment.user.toString() !== decodedToken.id.toString()) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    comment.content = req.body.content;
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
});

exports.delete = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodedToken.id || comment.user.toString() !== decodedToken.id.toString()) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const post = await Post.findById(req.params.id);
    const user = await User.findById(decodedToken.id);

    post.comments = post.comments.filter(c => c._id.toString() !== comment._id.toString());
    user.comments = user.comments.filter(c => c._id.toString() !== comment._id.toString());

    await post.save();
    await user.save();
    await comment.remove();

    res.status(204).end();
});