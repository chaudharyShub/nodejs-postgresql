const getFollowsCount = async (pool, userId) => {

    const followers_count = await pool.query(
        `select 
        count(*) as count from follows
        where follower_id = $1
        `,
        [userId]
    );

    const following_count = await pool.query(
        `select 
        count(*) as count from follows
        where following_id = $1
        `,
        [userId]
    );

    return {
        followers_count: Number(followers_count.rows[0].count),
        following_count: Number(following_count.rows[0].count)
    };
};

module.exports = getFollowsCount;