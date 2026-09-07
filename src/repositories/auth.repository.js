const pool = require('../config/db');
const getFollowsCount = require("../utils/getFollowsCount");

const findByEmail = async (email) => {
    const result = await pool.query(
        `select email, password_hash from users where email = $1`,
        [email]
    );

    return result.rows[0];
};

const getUserDetails = async (email) => {
    try {
        await pool.query('begin');

        const user_details = await pool.query(
            `select 
                u.email, 
                u.role, 
                u.id as user_id,
                p.bio, 
                p.avatar, 
                p.fname as first_name, 
                p.lname as last_name,
                p.username as username
            from users u 
            left join profiles p on u.id = p.user_id 
            where email = $1
            `,
            [email]
        );

        const userId = user_details.rows[0].user_id;

        const { followers_count, following_count } = await getFollowsCount(pool, userId);

        await pool.query('commit');

        return {
            ...user_details.rows[0],
            user_id: Number(userId),
            followers_count,
            following_count
        };
    } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
};

// executed when user is registered for the first time
const createUser = async (fname, lname, email, passwordHash, username) => {
    try {
        await pool.query('begin');

        const user_details = await pool.query(
            `with new_user as (
            insert into users (email, password_hash)
            values ($1, $2)
            returning id, email, role
        ),
        new_profile as (
            insert into profiles (fname, lname, username, user_id)
            select $3, $4, $5, id from new_user
            returning *
        )
        
        select  
            u.id as user_id,
            u.email,
            u.role,
            p.fname as first_name, 
            p.lname as last_name,
            p.username as username
        from new_user u 
        left join new_profile p 
            on u.id = p.user_id
            `,
            [email, passwordHash, fname, lname, username]
        );

        const userId = user_details.rows[0].user_id;

        const posts_count = await pool.query(
            `select 
                count(*) from posts
                where user_id = $1`,
            [userId]
        );

        const { followers_count, following_count } = await getFollowsCount(pool, userId);

        await pool.query('commit');

        return {
            ...user_details.rows[0],
            user_id: Number(user_details.rows[0].user_id),
            posts_count: Number(posts_count.rows[0].count),
            followers_count,
            following_count
        };
    } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
};

module.exports = {
    findByEmail,
    createUser,
    getUserDetails
};

