const express = require("express");
const router = express.Router();
const postAPI = require("../../../controllers/api/v1/posts_api");
router.use("/", postAPI.index);
module.exports = router;