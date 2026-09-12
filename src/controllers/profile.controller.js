const profileService = require('../services/profile.service');

const getMyProfile = async (req, res, next) => {
    try {
        const result = await profileService.getMyProfile(req.user.id);

        res.status(200).json({
            message: "Your data fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const result = await profileService.getUserProfile(req.params.user_name);

        res.status(200).json({
            message: "User fetched successfully",
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

const followUnfollowUser = () => { };

module.exports = {
    getUserProfile,
    updateProfile,
    getMyProfile,
    followUnfollowUser
};