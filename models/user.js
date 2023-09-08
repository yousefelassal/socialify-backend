const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, minlength: 3 },
    passwordHash: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    liked_posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    liked_comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profile_pic: { type: String, default: 'https://raw.githubusercontent.com/vercel/next-learn/master/basics/basics-final/public/images/profile.jpg' },
    bio: { type: String, default: '' },
    dob: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.virtual('url').get(function () {
    return `/${this.username}`;
});

userSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
    }
});

module.exports = mongoose.model('User', userSchema);