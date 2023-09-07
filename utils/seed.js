const mongoose = require('mongoose');
const config = require('./config');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

mongoose.connect(config.MONGODB_URI).then(() => {
    console.log('connected to MongoDB');
}).catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
});

const seed = async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});

    const user = new User({
        username: 'test',
        name: 'test',
        passwordHash: 'test',
        posts: [],
        comments: [],
        liked_posts: [],
        liked_comments: [],
        following: [],
        followers: [],
        profile_pic: 'https://res.cloudinary.com/dx6tl6aa2/image/upload/v1595347704/default_profile_pic.png',
        bio: '',
        dob: new Date()
    });

    await user.save();

    const post = new Post({
        content: 'test',
        user: user._id,
        likes: 0,
        comments: [],
        date: new Date(),
        liked_by: []
    });

    await post.save();

    const comment = new Comment({
        content: 'test',
        post: post._id,
        user: user._id
    });
    
    await comment.save();

    user.posts = user.posts.concat(post._id);
    user.comments = user.comments.concat(comment._id);
    user.liked_posts = user.liked_posts.concat(post._id);
    user.liked_comments = user.liked_comments.concat(comment._id);
    user.following = user.following.concat(user._id);
    user.followers = user.followers.concat(user._id);

    await user.save();

    post.comments = post.comments.concat(comment._id);
    post.liked_by = post.liked_by.concat(user._id);

    await post.save();

    comment.liked_by = comment.liked_by.concat(user._id);

    await comment.save();

    mongoose.connection.close();
};

seed().then(() => {
    console.log('seeded');
});