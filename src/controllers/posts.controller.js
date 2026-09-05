const postService = require("../services/posts.service");

const createPost = async (req, res, next) => {
    try {
        const { caption } = req.body;

        const post = await postService.createPost({
            userId: req.user.id,
            caption,
            image: req.file
        });

        res.status(201).json({
            message: "Post created successfully",
            data: post
        });
    } catch (error) {
        next(error);
    }
};

const getPosts = async (req, res, next) => {
    try {
        const posts = await postService.getPosts(req.user.id);

        res.status(200).json({
            message: "Posts fetched successfully",
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getPosts
};