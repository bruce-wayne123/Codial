const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
module.exports.createSession = async function (req, resp) {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user || user.password != req.body.password) {
            resp.json(422, {
                message: "Invalid username/password"
            })
        }
        else {
            resp.json(200, {
                message: "Sign in successful,here is your token.Please keep it safe.",
                data: {
                    token: jwt.sign(user.toJSON(), 'codial', { expiresIn: '100000' })
                }
            })
        }

    } catch (error) {
        console.log("****Error****", error);
        resp.json(500, {
            message: "Internal server error"
        })

    }

}