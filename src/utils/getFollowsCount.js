const getFollowsCount = async (pool, user_name) => {

    const followers_count = await pool.query(
        `select 
        count(*)::int as count from follows
        where follower_id = $1
        `,
        [user_name]
    );

    const following_count = await pool.query(
        `select 
        count(*)::int as count from follows
        where following_id = $1
        `,
        [user_name]
    );

    const posts_count = await pool.query(
        `select 
        count(*)::int from posts
        where user_id = $1`,
        [user_name]
    );

    return {
        followers_count: followers_count.rows[0].count,
        following_count: following_count.rows[0].count,
        posts_count: posts_count.rows[0].count
    };
};

module.exports = getFollowsCount;