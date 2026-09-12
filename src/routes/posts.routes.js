const express = require('express');

const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const authenticate = require("../middlewares/authenticate.middleware");

const postsController = require("../controllers/posts.controller");

router.post('/', authenticate, upload.single("image"), postsController.createPost);

router.get('/:username', postsController.getPosts);
router.get('/:id/likes', postsController.getPostLikesList);
router.get('/:id/comments', postsController.getPostComments);

router.post('/like/:id', authenticate, postsController.likeUnlikePost);

router.post('/comment', authenticate, postsController.commentOnPost);
router.put('/comment/:id', authenticate, postsController.updateCommentOnPost);

module.exports = router;
