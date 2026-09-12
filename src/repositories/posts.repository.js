const pool = require("../config/db");

const createPost = async ({ userId, caption, imageUrl }) => {
    const result = await pool.query(
        `
        with new_post as (
            insert into posts (
                user_id,
                caption,
                image_url
            )
            values ($1, $2, $3)
            returning caption, image_url, id as post_id
        )
        select 
            caption, 
            image_url, 
            post_id::int,
            0 as likes_count,
            0 as comments_count
        from new_post
        `,
        [userId, caption, imageUrl]
    );

    return result.rows[0];
};

const getPosts = async (user_name) => {
    const result = await pool.query(
        `select
            p.id::int as post_id,
            p.image_url, 
            p.caption, 
            p.created_at,
            ( select count(*) from likes l where l.post_id = p.id )::int as likes_count,
            ( select count(*) from comments c where c.post_id = p.id )::int as comments_count,
        from posts p
        left join profiles pf on p.user_id = pf.user_id
        where pf.username = $1`, [user_name]
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
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const deleted = await client.query(
            `DELETE FROM likes
             WHERE post_id = $1
               AND user_id = $2
             RETURNING id`,
            [post_id, user_id]
        );

        if (deleted.rowCount > 0) {
            const result = await client.query(
                `SELECT COUNT(*)::int AS count
                 FROM likes
                 WHERE post_id = $1`,
                [post_id]
            );

            await client.query('COMMIT');

            return {
                liked: false,
                likes: result.rows[0].count
            };
        }

        await client.query(
            `INSERT INTO likes (post_id, user_id)
             VALUES ($1, $2)`,
            [post_id, user_id]
        );

        const result = await client.query(
            `SELECT COUNT(*)::int AS count
             FROM likes
             WHERE post_id = $1`,
            [post_id]
        );

        await client.query('COMMIT');

        return {
            liked: true,
            likes: result.rows[0].count
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getPostLikesList = async (post_id) => {
    const result = await pool.query(
        `select 
	        l.user_id::int,
	        p.username,
	        p.avatar,
	        p.fname,
	        p.lname
	    from likes l 
	    left join profiles p on l.user_id = p.user_id where l.post_id = $1
        `, [post_id]
    );

    return result.rows;
};

const getPostComments = async (post_id) => {
    const result = await pool.query(
        `select 
	        c.user_id::int,
	        c.comment,
	        p.username,
	        p.avatar,
	        p.fname as first_name,
	        p.lname as last_name
	    from comments c 
	    left join profiles p on c.user_id = p.user_id where c.post_id = $1
        `, [post_id]
    );

    return result.rows;
};

module.exports = {
    createPost,
    getPosts,
    commentOnPost,
    updateCommentOnPost,
    likeUnlikePost,
    getPostLikesList,
    getPostComments
};