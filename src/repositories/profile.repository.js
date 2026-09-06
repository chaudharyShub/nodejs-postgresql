const pool = require('../config/db');

const getProfileData = async (id) => {
    const result = await pool.query(
        `select 
            u.id,
            u.email, 
            u.role, 
            p.bio, 
            p.avatar, 
            p.fname, 
            p.username,
            p.lname 
        from users u 
        left join profiles p on u.id = p.user_id 
        where u.id = $1`, [id]
    );

    return result.rows[0];
};

const getAllProfileData = async () => {
    const result = await pool.query(
        `select 
            u.id,
            u.email, 
            u.role, 
            p.bio, 
            p.avatar, 
            p.fname, 
            p.username,
            p.lname 
        from users u 
        left join profiles p on u.id = p.user_id`
    );

    return result.rows;
};

const updateProfile = async ({ userId, body, avatar }) => {
    const { bio, fname, lname } = body;

    let result;

    if (!avatar) {
        result = await pool.query(
            `update profiles 
                set bio = $1, fname = $2, lname = $3
                where user_id = $4
                returning *`,
            [bio, fname, lname, userId]
        );
    } else {
        result = await pool.query(
            `update profiles 
                set bio = $1, fname = $2, lname = $3, avatar = $4 
                where user_id = $5
                returning *`,
            [bio, fname, lname, avatar, userId]
        );
    }

    return result.rows;
};

module.exports = {
    getProfileData,
    getAllProfileData,
    updateProfile
};