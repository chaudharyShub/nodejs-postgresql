const express = require('express');
const { getAllProfileData, getProfileData } = require("../controllers/profile.controller");

const router = express.Router();

router.get('/', getAllProfileData); // temp
router.get('/:id', getProfileData);

module.exports = router;
