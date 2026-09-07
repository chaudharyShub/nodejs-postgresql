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
        // `select
        //     id, image_url, caption, created_at
        //     from posts where user_id = $1`, [id]
        `select
            p.id, 
            p.image_url, 
            p.caption, 
            p.created_at,
            l.user_id,
            c.user_id,
            c.comment
            from posts p 
            left join 
                likes l on p.id = l.post_id
            left join 
                comments c on p.id = c.post_id
            where p.user_id = $1`, [id]
    );

    return result.rows;
};

const commentOnPost = async (user_id, post_id, comment) => {
    const result = await pool.query(
        `insert into comments (post_id, user_id, comment)
            values ($1, $2, $3)
            returning *`,
        [post_id, user_id, comment]
    );

    return result.rows;
};

const updateCommentOnPost = async (user_id, comment_id, comment) => {
    const result = await pool.query(
        `update comments 
            set comment = $3 
            where id = $2 and user_id = $1
            returning *`,
        [user_id, comment_id, comment]
    );

    return result.rows[0];
};

const likeUnlikePost = async (post_id, user_id) => {
    try {
        await pool.query('begin');

        const result = await pool.query(
            `delete from likes 
                where post_id = $1 and user_id = $2
                returning *`,
            [post_id, user_id]
        );

        if (result.rowCount === 0) {
            const result = await pool.query(
                `insert into likes (post_id, user_id)
                values ($1, $2)
                returning *`,
                [post_id, user_id]
            );

            await pool.query('commit');

            return {
                liked: true,
                likes: result.rows[0]
            };
        }

        await pool.query('commit');

        return {
            liked: false,
            likes: null
        };
    } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
};

module.exports = {
    createPost,
    getPosts,
    commentOnPost,
    updateCommentOnPost,
    likeUnlikePost
};