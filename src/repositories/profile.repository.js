const pool = require('../config/db');
const getFollowsCount = require("../utils/getFollowsCount");

const getProfileData = async (id) => {
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
        left join profiles p on user_id = p.user_id 
        where user_id = $1`, [id]
        );

        const { followers_count, following_count } = await getFollowsCount(pool, id);

        await pool.query('commit');

        return {
            ...result.rows[0],
            user_id: Number(result.rows[0].user_id),
            followers_count,
            following_count
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
                returning avatar, bio, fname, lname, user_id, username`,
        [bio, fname, lname, avatar ?? null, userId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

module.exports = {
    getProfileData,
    updateProfile
};