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

    try {
        return await postRepository.createPost({
            userId,
            caption,
            imageUrl: result.secure_url
        });
    } catch (error) {
        await cloudinary.uploader
            .destroy(result.public_id)
            .catch((cleanupError) => {
                console.error("Failed to clean up orphaned Cloudinary asset:", result.public_id, cleanupError);
            });

        throw error;
    }
};

const commentOnPost = async (user_id, post_id, comment) => {
    return await postRepository.commentOnPost(user_id, post_id, comment);
};

const updateCommentOnPost = async (user_id, comment_id, comment) => {
    return await postRepository.updateCommentOnPost(user_id, comment_id, comment);
};

const getPosts = async (id) => {
    return await postRepository.getPosts(id);
};

const likeUnlikePost = async (post_id, user_id) => {
    return await postRepository.likeUnlikePost(post_id, user_id);
};

module.exports = {
    createPost,
    getPosts,
    commentOnPost,
    updateCommentOnPost,
    likeUnlikePost
};