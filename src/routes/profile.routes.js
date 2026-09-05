const express = require('express');

const authenticate = require("../middlewares/authenticate.middlewares");
const { getAllProfileData, getProfileData } = require("../controllers/profile.controller");

const router = express.Router();

router.get('/', authenticate, getAllProfileData); // temp
router.get('/:id', authenticate, getProfileData);

module.exports = router;
