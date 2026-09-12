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

const likeUnlikePost = async (req, res, next) => {
    try {
        const post_id = req.params.id;
        const user_id = req.user.id;

        const result = await postService.likeUnlikePost(post_id, user_id);

        res.status(201).json({
            message: "Post Liked successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const commentOnPost = async (req, res, next) => {
    try {
        const { comment, post_id } = req.body;

        const result = await postService.commentOnPost(req.user.id, post_id, comment);

        res.status(201).json({
            message: "Commented successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const updateCommentOnPost = async (req, res, next) => {
    try {
        const { comment } = req.body;
        const comment_id = req.params.id;

        const result = await postService.updateCommentOnPost(req.user.id, comment_id, comment);

        res.status(200).json({
            message: "Comment updated",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getPosts = async (req, res, next) => {
    try {
        const username = req.params.username;
        const posts = await postService.getPosts(username);

        res.status(200).json({
            message: "Posts fetched successfully",
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

const getPostLikesList = async (req, res, next) => {
    try {
        const post_id = req.params.id;
        const posts = await postService.getPostLikesList(post_id);

        res.status(200).json({
            message: "Posts fetched successfully",
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

const getPostComments = async (req, res, next) => {
    try {
        const post_id = req.params.id;
        const posts = await postService.getPostComments(post_id);

        res.status(200).json({
            message: "Posts fetched successfully",
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

// const getPostById = async (req, res, next) => {
//     try {
//         const post_id = req.params.id;

//         const post = await postService.getPostById(post_id);

//         res.status(200).json({
//             message: "Posts fetched successfully",
//             data: post
//         });
//     } catch (error) {

//     }
// };

module.exports = {
    createPost,
    getPosts,
    commentOnPost,
    updateCommentOnPost,
    likeUnlikePost,
    getPostLikesList,
    getPostComments
};