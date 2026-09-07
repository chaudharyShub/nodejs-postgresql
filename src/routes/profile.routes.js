const express = require('express');

const upload = require("../middlewares/upload.middleware");
const authenticate = require("../middlewares/authenticate.middleware");
const { getProfileData, updateProfile } = require("../controllers/profile.controller");

const router = express.Router();

router.get('/:id', authenticate, getProfileData);
router.put('/', authenticate, upload.single("image"), updateProfile);

module.exports = router;
