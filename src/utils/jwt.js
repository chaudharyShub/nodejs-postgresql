const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const generateToken = (user) => {
    const token = jwt.sign(
        {
            username: user.username,
            email: user.email,
            role: user.role,
            id: user.id
        },
        process.env.JWT_SECRET,
        // {
        //     expiresIn: process.env.JWT_EXPIRES_IN
        // }
    );

    return token;
};

module.exports = { verifyToken, generateToken };
