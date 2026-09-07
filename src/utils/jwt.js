const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const token = jwt.sign(
        {
            username: user.username,
            email: user.email,
            role: user.role,
            id: user.user_id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return token;
};

module.exports = { generateToken };
