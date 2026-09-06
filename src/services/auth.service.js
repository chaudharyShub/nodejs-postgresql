const bcrypt = require("bcrypt");
const { findByEmail, createUser, getUserDetails } = require("../repositories/auth.repository");
const { generateToken } = require("../utils/jwt");

const register = async (fname, lname, email, password, username) => {
    const existingUser = await findByEmail(email);

    if (existingUser) throw new Error("Email already registered, please login to continue!");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser(fname, lname, email, passwordHash, username);

    const token = generateToken(user);

    return {
        user, token
    };
};

const login = async (email, password) => {
    const user = await findByEmail(email);

    if (!user) throw new Error("Email doesn't exist, please register to continue!");

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) throw new Error("Invalid password");

    const userDetails = await getUserDetails(email);

    const token = generateToken(userDetails);

    return {
        user: {
            id: userDetails.id,
            fname: userDetails.fname,
            lname: userDetails.lname,
            email: userDetails.email,
            role: userDetails.role,
            username: userDetails.username,
            bio: userDetails.bio,
            avatar: userDetails.avatar,
        },
        token
    };
};

module.exports = {
    register,
    login
};