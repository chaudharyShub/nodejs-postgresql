const profileService = require('../services/profile.service');

const getProfileData = async (req, res, next) => {
    try {
        const result = await profileService.getProfileData(req.params.id);

        res.status(200).json({
            message: "User fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getAllProfileData = async (req, res, next) => {
    try {
        const result = await profileService.getAllProfileData();

        res.status(200).json({
            message: "All users fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfileData,
    getAllProfileData
};