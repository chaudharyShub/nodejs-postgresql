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

module.exports = {
    getProfileData,
    getAllProfileData
};