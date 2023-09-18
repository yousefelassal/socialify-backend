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

exports.like = asyncHandler(async (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const post = await Post.findById(req.params.id);
    const user = await User.findById(decodedToken.id);

    if (post.liked_by.includes(user._id)) {
        return res.status(400).json({ error: 'post already liked' });
    }

    post.liked_by = post.liked_by.concat(user._id);
    post.likes = post.likes + 1;
    user.liked_posts = user.liked_posts.concat(post._id);

    await post.save();
    await user.save();

    res.status(201).json(post);
});

exports.unlike = asyncHandler(async (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const post = await Post.findById(req.params.id);
    const user = await User.findById(decodedToken.id);

    if (!post.liked_by.includes(user._id)) {
        return res.status(400).json({ error: 'post not liked' });
    }

    post.liked_by = post.liked_by.filter(u => u._id !== user._id);
    post.likes = post.likes - 1;
    user.liked_posts = user.liked_posts.filter(p => p._id !== post._id);

    await post.save();
    await user.save();

    res.status(201).json(post);
});

exports.likeComment = asyncHandler(async (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const comment = await Comment.findById(req.params.id);
    const user = await User.findById(decodedToken.id);

    if (comment.liked_by.includes(user._id)) {
        return res.status(400).json({ error: 'comment already liked' });
    }

    comment.liked_by = comment.liked_by.concat(user._id);
    comment.likes = comment.likes + 1;
    user.liked_comments = user.liked_comments.concat(comment._id);

    await comment.save();
    await user.save();

    res.status(201).json(comment);
});

exports.unlikeComment = asyncHandler(async (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const comment = await Comment.findById(req.params.id);
    const user = await User.findById(decodedToken.id);

    if (!comment.liked_by.includes(user._id)) {
        return res.status(400).json({ error: 'comment not liked' });
    }

    comment.liked_by = comment.liked_by.filter(u => u._id !== user._id);
    comment.likes = comment.likes - 1;
    user.liked_comments = user.liked_comments.filter(c => c._id !== comment._id);

    await comment.save();
    await user.save();

    res.status(201).json(comment);
});
