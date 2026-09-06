const cloudinary = require("../config/cloudinary");
const profileRepo = require("../repositories/profile.repository");

const getProfileData = async (id) => {
    const user = await profileRepo.getProfileData(id);

    return {
        user
    };
};

const getAllProfileData = async () => {
    const user = await profileRepo.getAllProfileData();

    return {
        user
    };
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
        user
    };
};

module.exports = {
    getProfileData,
    getAllProfileData,
    updateProfile
};