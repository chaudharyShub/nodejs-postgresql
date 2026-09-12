const cloudinary = require("../config/cloudinary");
const profileRepo = require("../repositories/profile.repository");

const getMyProfile = async (user_id) => {
    return await profileRepo.getMyProfile(user_id);
};

const getUserProfile = async (user_name) => {
    return await profileRepo.getUserProfile(user_name);
};

const updateProfile = async ({ userId, body, avatar }) => {
    let user = {};

    if (!avatar) {
        user = await profileRepo.updateProfile({
            userId,
            body,
        });
    } else {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "fullstack-app/dp"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(avatar.buffer);
        });

        user = await profileRepo.updateProfile({
            userId,
            body,
            avatar: result.secure_url
        });
    }
    return {
        user: {
            ...user,
            user_id: Number(user.user_id),
        }
    };
};

module.exports = {
    getUserProfile,
    updateProfile,
    getMyProfile
};