const Post = require('../models/post');
const User = require('../models/user');

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

    if (!post) {
        return res.status(400).json({ error: 'post not found' });
    }

    const comment = {
        content: req.body.content,
        user: user._id,
        post: post._id
    }

    const savedComment = await new Comment(comment).save();
    post.comments = post.comments.concat(savedComment._id);
    user.comments = user.comments.concat(savedComment._id);

    await post.save();
    await user.save();

    res.status(201).json(savedComment);
});

exports.update = asyncHandler(async (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const comment = await Comment.findById(req.params.commentId);
    const user = await User.findById(decodedToken.id);

    if (!comment) {
        return res.status(400).json({ error: 'comment not found' });
    }

    if (comment.user.toString() !== user._id.toString()) {
        return res.status(401).json({ error: 'user not authorized' });
    }

    comment.content = req.body.content;

    await comment.save();

    res.status(201).json(comment);
});

exports.delete = asyncHandler(async (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const comment = await Comment.findById(req.params.commentId);
    const user = await User.findById(decodedToken.id);

    if (!comment) {
        return res.status(400).json({ error: 'comment not found' });
    }

    if (comment.user.toString() !== user._id.toString()) {
        return res.status(401).json({ error: 'user not authorized' });
    }

    await Comment.findByIdAndRemove(req.params.commentId);

    res.status(204).end();
});