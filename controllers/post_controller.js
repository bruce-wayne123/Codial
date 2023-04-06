const Post = require("../models/post");
const Comment = require("../models/comment")
module.exports.create = async function (req, resp) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        if (req.xhr) {
            return resp.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }
        req.flash("success", "Post published");
        return resp.redirect("/");
    } catch (error) {
        console.log("Error in creating post", error);
        req.flash("error", "Error in creating post");
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
                if (req.xhr) {
                    return resp.status(200).json({
                        data: {
                            post_id: req.params.id
                        },
                        message: "Post deleted."
                    });
                }
                req.flash("success", "Post deleted");
                return resp.redirect("/");
            }
            else {
                req.flash("error", "You cannot delete this post.");
                return resp.redirect("/");
            }
        }

    } catch (error) {
        console.log("Error in finding post to delete", error);
        req.flash("error", "Oops. Something went wrong");
    }
}