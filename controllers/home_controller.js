const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = async function (req, resp) {
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
            
        let users = await User.find({});
        return resp.render("home", { title: "Codial Home", posts: posts, all_users: users });
    } catch (error) {
        console.log("Error in finding post", error);
    }
}

module.exports.login = function (req, resp) {
    return resp.end("<h1>LOGIN PAGE </h1>");
}