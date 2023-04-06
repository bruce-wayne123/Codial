const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
module.exports.index = async function index(req, resp) {

    try {
        let posts = await Post.find({})
            .sort("-createdAt")
            .populate('user')
            .populate(
                {
                    path: "comments",
                    populate: {
                        path: 'user'
                    }
                }
            );

        return resp.json(200, {
            message: "List of posts",
            posts: posts
        })
    } catch (error) {
        console.log("Error in finding post", error);
    }
}

module.exports.destroy = async function (req, resp) {
    try {
        let post = await Post.findById(req.params.id);
        if (post) {
            //.id means converting the object id to string
            if (post.user == req.user.id) {
                await Post.findByIdAndDelete(post._id).catch(function (error) {
                    if (error) {
                        console.log("Error in deleting the post", error);
                        return;
                    }
                });
                await Comment.deleteMany({ post: req.params.id });
                return resp.json(200, { message: "Post and comments deleted succesfully" })
            }
        }
        else {
            return resp.json(401, {
                message: "You cannot delete this post"
            });
        }
    } catch (error) {
        console.log("Error in finding post to delete", error);
        return resp.json(500, {
            message: "Internal server error"
        });
    }
}