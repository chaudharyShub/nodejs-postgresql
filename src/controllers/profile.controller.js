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

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const body = req.body;
        const avatar = req.file;

        const result = await profileService.updateProfile({
            userId,
            body,
            avatar
        });

        res.status(200).json({
            message: "Profile updated successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfileData,
    getAllProfileData,
    updateProfile
};