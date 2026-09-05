const pool = require("../config/db");

const createPost = async ({ userId, caption, imageUrl }) => {
    const result = await pool.query(
        `
        INSERT INTO posts (
            user_id,
            caption,
            image_url
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [userId, caption, imageUrl]
    );

    return result.rows[0];
};

const getPosts = async (id) => {
    const result = await pool.query(
        `select
            id, image_url, caption, created_at
            from posts where user_id = $1`, [id]
    );

    return result.rows;
};

module.exports = {
    createPost,
    getPosts
};