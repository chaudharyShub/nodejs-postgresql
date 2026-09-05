const cloudinary = require("../config/cloudinary");
const postRepository = require("../repositories/posts.repository");

const createPost = async ({ userId, caption, image }) => {
    if (!image) {
        throw new Error("Image is required");
    }

    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "fullstack-app/posts"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(image.buffer);
    });

    return await postRepository.createPost({
        userId,
        caption,
        imageUrl: result.secure_url
    });
};

const getPosts = async (id) => {
    return await postRepository.getPosts(id);
};

module.exports = {
    createPost,
    getPosts
};