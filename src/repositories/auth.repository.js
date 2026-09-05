const pool = require('../config/db');

const findByEmail = async (email) => {
    const result = await pool.query(
        `select email, password_hash from users where email = $1`,
        [email]
    );

    return result.rows[0];
};

const getUserDetails = async (email) => {
    const result = await pool.query(
        `select 
            u.email, 
            u.role, 
            p.bio, 
            p.avatar, 
            p.fname, 
            p.username,
            p.lname 
        from users u 
        left join profiles p on u.id = p.user_id 
        where email = $1`,
        [email]
    );

    return result.rows[0];
};

const createUser = async (fname, lname, email, passwordHash, username) => {
    const result = await pool.query(
        `with new_user as (
            insert into users (email, password_hash)
            values ($1, $2)
            returning *
        ),
        new_profile as (
            insert into profiles (fname, lname, username, user_id)
            select $3, $4, $5, id from new_user
            returning *
        )
        
        select  
            u.email, 
            u.role, 
            p.fname, 
            p.lname,
            p.username
        from new_user u left join new_profile p on u.id = p.id
            `,
        [email, passwordHash, fname, lname, username]
    );

    return result.rows[0];
};

module.exports = {
    findByEmail,
    createUser,
    getUserDetails
};