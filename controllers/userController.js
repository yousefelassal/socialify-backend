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
    const users = await User.find({})
    res.json(users);
});

userRouter.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate('comments following followers liked_posts liked_comments')
        .populate({
            path: 'posts',
            populate: {
                path: 'comments',
                populate: {
                    path: 'post',
                    populate: {
                        path: 'user',
                    }
                }
            }
        })
        .populate({
            path: 'posts',
            populate: {
                path: 'liked_by',
                select: 'username name profile_pic'
            }
        })
        .populate({
            path: 'comments',
            populate: {
                path: 'post',
                populate: {
                    path: 'user',
                }
            }
        })
        .populate({
            path: 'liked_posts',
            populate: {
                path: 'user',
            }
        })
        .populate({
            path: 'liked_comments',
            populate: {
                path: 'user',
            }
        })
        // TODO: populate following and followers, ...
    res.json(user);
});

module.exports = userRouter;