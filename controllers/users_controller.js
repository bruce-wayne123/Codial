const User = require('../models/user');
const fs = require("fs");
const path = require("path");
module.exports.profile = async function (req, resp) {
   var user = await User.findById(req.params.id);
   if (user) {
      return resp.render('users-profile', {
         title: 'User Profile', profile_user: user
      })
   }
}
module.exports.signUp = function (req, resp) {
   if (req.isAuthenticated()) {
      return resp.redirect("/users/profile")
   }

   return resp.render("user_signup", { title: "Codial Sign Up" });
}

module.exports.signIn = function (req, resp) {
   if (req.isAuthenticated()) {
      return resp.redirect("/users/profile")
   }
   return resp.render("user_signin", { title: "Codial Sign In" });
}

module.exports.create = function (req, resp) {
   try {
      if (req.body.password != req.body.confirmpassword) {
         return resp.redirect("/");
      }
      User.findOne({ email: req.body.email })
         .catch(function (error) {
            console.log("Error in finding user", error);
         })
         .then(function (user) {
            if (!user) {
               User.create(req.body)
                  .catch(function (error) {
                     console.log("Error in creating user", error);
                  })
            }
            else {
               return resp.redirect('back');
            }
         });
      return resp.render("user_signin", { title: "Codial Sign In" });
   } catch (error) {
      console.log("Error in creating user", error);
   }
}

module.exports.createSession = async function (req, resp) {
   req.flash("success", 'Logged In successfully');
   return (resp.redirect("/"));
}

module.exports.destroySession = async function (req, resp) {
   req.logout(function (err) {
      if (err) { console.log(err); }
      req.flash("success", 'You have logged out !');
      resp.redirect('/');
   });
}

module.exports.update = async function (req, resp) {
   try {
      if (req.user.id == req.params.id) {
         let user = await User.findById(req.params.id);
         User.uploadedAvatar(req, resp, function (error) {
            if (error) {
               console.log(error);
            }
            user.name = req.body.name;
            user.email = req.body.email;
            if (req.file) {
               if (user.avatar) {
                  //TODO : Implement code to check if the file exists before deleting the file
                  fs.unlinkSync(path.join(__dirname, '..', user.avatar));
               }
               //this is saving the path of the uploded file into avatar field of the user
               user.avatar = User.avatarPath + "/" + req.file.filename;
            }
            user.save();
            req.flash("success", "User details updated successfully.");
            resp.redirect('/');
         })
         if (!user) {
            return resp.status(401).send("Unauthorised");
         }
      }
      else {
         req.flash("error", "Unauthorised");
         resp.status(401).send("Unauthorised");
      }
   } catch (error) {
      req.flash("error", "Oops something went wrong.");
      console.log("Error in updating user information", error);
   }
}