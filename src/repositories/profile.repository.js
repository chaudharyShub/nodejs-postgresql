const pool = require('../config/db');
const getFollowsCount = require("../utils/getFollowsCount");

const getMyProfile = async (user_id) => {
    try {
        await pool.query('begin');

        const result = await pool.query(
            `select 
            u.id as user_id,
            p.bio, 
            p.avatar, 
            p.fname as first_name, 
            p.lname as last_name,
            p.username as username
        from users u 
        left join profiles p on u.id = p.user_id 
        where p.user_id = $1`, [user_id]
        );

        const { followers_count, following_count, posts_count } = await getFollowsCount(pool, user_id);

        await pool.query('commit');

        return {
            ...result.rows[0],
            user_id: Number(result.rows[0].user_id),
            followers_count,
            following_count,
            posts_count
        };
    } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
};

const getUserProfile = async (user_name) => {
    try {
        await pool.query('begin');

        const result = await pool.query(
            `select 
            u.id::int as user_id,
            p.bio, 
            p.avatar, 
            p.fname as first_name, 
            p.lname as last_name,
            p.username as username
        from users u 
        left join profiles p on u.id = p.user_id 
        where p.username = $1`, [user_name]
        );

        const user_id = result.rows[0].user_id;

        const { followers_count, following_count, posts_count } = await getFollowsCount(pool, user_id);

        await pool.query('commit');

        return {
            ...result.rows[0],
            followers_count,
            following_count,
            posts_count
        };
    } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
};

const updateProfile = async ({ userId, body, avatar }) => {
    const { bio, fname, lname } = body;

    const result = await pool.query(
        `update profiles 
                set 
                    bio = $1, 
                    fname = $2, 
                    lname = $3,
                    avatar = COALESCE($4, avatar)
                where user_id = $5
                returning avatar, bio, fname as first_name, lname as last_name, user_id, username`,
        [bio, fname, lname, avatar ?? null, userId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const { followers_count, following_count, posts_count } = await getFollowsCount(pool, userId);

    return {
        ...result.rows[0],
        followers_count,
        following_count,
        posts_count
    };
};

module.exports = {
    getUserProfile,
    updateProfile,
    getMyProfile
};