const searchRouter = require('express').Router();
const User = require('../models/user');
const Post = require('../models/post');

searchRouter.get('/', async (req, res) => {
    const { query } = req.query;
    const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('username name profile_pic');
    const posts = await Post.find({ content: { $regex: query, $options: 'i' } }).populate('user', 'username name profile_pic');
    res.json({ users, posts });
});

searchRouter.get('/users', async (req, res) => {
    const users = await User.find({}).select('username name profile_pic');
    res.json(users);
});

searchRouter.get('/posts', async (req, res) => {
    const posts = await Post.find({}).populate('user', 'username name profile_pic');
    res.json(posts);
});

//TODO: implement search by tags
//TODO: implement search history
//TODO: implement delete search history

module.exports = searchRouter;
