const cloudinary = require("../config/cloudinary");
const profileRepo = require("../repositories/profile.repository");

const getProfileData = async (id) => {
    return await profileRepo.getProfileData(id);
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
            avatar: user.avatar,
            bio: user.bio,
            first_name: user.fname,
            last_name: user.lname,
            user_id: Number(user.user_id),
            username: user.username,
        }
    };
};

module.exports = {
    getProfileData,
    // getAllProfileData,
    updateProfile
};