const express = require('express');

const upload = require("../middlewares/upload.middleware");
const authenticate = require("../middlewares/authenticate.middleware");

const router = express.Router();

const {
    getPosts,
    createPost,
    commentOnPost,
    updateCommentOnPost,
    likeUnlikePost
} = require("../controllers/posts.controller");

router.post('/', authenticate, upload.single("image"), createPost);
router.get('/', authenticate, getPosts);

router.post('/like/:id', authenticate, likeUnlikePost);

router.post('/comment', authenticate, commentOnPost);
router.put('/comment/:id', authenticate, updateCommentOnPost);

module.exports = router;
