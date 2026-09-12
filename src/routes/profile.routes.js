const express = require('express');

const upload = require("../middlewares/upload.middleware");
const authenticate = require("../middlewares/authenticate.middleware");
const profileController = require("../controllers/profile.controller");

const router = express.Router();

router.get('/:user_name', profileController.getUserProfile);
router.get('/me', authenticate, profileController.getMyProfile);
router.get('/:user_name', authenticate, profileController.followUnfollowUser);
router.put('/', authenticate, upload.single("image"), profileController.updateProfile);

module.exports = router;
