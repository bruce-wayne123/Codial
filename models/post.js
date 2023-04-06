const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User',
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: 'Comment',
            }
        ]
        //Include the array of comments in post schema itself
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;