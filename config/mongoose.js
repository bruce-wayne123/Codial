const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1/codial_dev");

const db = mongoose.connection;

db.on("error", function (error) {
    console.log("Error in connecting to MongoDB", error)
});

db.once("open", function () {
    console.log("Connected to database :: MongoDB")
});

module.exports = db;