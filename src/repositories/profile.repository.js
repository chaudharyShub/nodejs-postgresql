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

module.exports = {
    getProfileData,
    getAllProfileData
};