const bcrypt = require('bcrypt');
const User = require('../models/user');
const userRouter = require('express').Router();

userRouter.post('/', async (req, res) => {
    const { username, password, name } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
});

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('posts', { content: 1, date: 1 });
    res.json(users);
});

module.exports = userRouter;