const express = require('express');

const upload = require("../middlewares/upload.middleware");
const authenticate = require("../middlewares/authenticate.middleware");
const { getAllProfileData, getProfileData, updateProfile } = require("../controllers/profile.controller");

const router = express.Router();

router.get('/', authenticate, getAllProfileData); // temp, implement "admin" authorization
router.get('/:id', authenticate, getProfileData);
router.put('/', authenticate, upload.single("image"), updateProfile);

module.exports = router;
