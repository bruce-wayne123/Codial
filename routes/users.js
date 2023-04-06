const express = require("express");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const usersController = require("../controllers/users_controller");
router.get("/profile/:id", passport.checkAuthentication, usersController.profile);
router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);
router.post("/sign-in", usersController.createSession);
//Use passport as middleware to auuthenticate
router.post("/create-session", passport.authenticate(
    'local', { failureRedirect: "/users/sign-in" }), usersController.createSession);
router.post("/create", usersController.create);
router.get("/sign-out", usersController.destroySession);
router.post("/update/:id", usersController.update);
module.exports = router;