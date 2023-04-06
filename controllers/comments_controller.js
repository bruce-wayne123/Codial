const Comment = require("../models/comment");
const Post = require("../models/post");
module.exports.create = async function (req, resp) {

    try {
        let post = await Post.findById(req.body.post)
            .catch(function (error) {
                if (error) {
                    console.log("Error in finding post for creating comment", error);
                    return;
                }
            });
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            if (comment) {
                post.comments.push(comment);
                post.save();
                req.flash("success", "Comment added");
                resp.redirect("/");
            }

        }
    } catch (error) {
        req.flash("error", "Oops. Something went wrong");
        console.log("Error", error);
    }

};

module.exports.destroy = async function (req, resp) {
    try {
        let comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            let postId = comment.post;

            await Comment.findByIdAndDelete(comment.id).catch(function (error) {
                if (error) {
                    console.log("Error in deleting comment", error);
                    return;
                }
            });
            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            req.flash("success", "Comment deleted");
        }
        return resp.redirect("/");

    } catch (error) {
        req.flash("error", "Oops. Something went wrong");
        console.log("Error", error);
    }
}