const express = require('express');

const upload = require("../middlewares/upload.middleware");
const authenticate = require("../middlewares/authenticate.middleware");

const router = express.Router();

const { createPost, getPosts } = require("../controllers/posts.controller");

router.post('/', authenticate, upload.single("image"), createPost);
router.get('/', authenticate, getPosts);

module.exports = router;
