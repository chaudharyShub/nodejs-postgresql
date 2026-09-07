const bcrypt = require("bcrypt");
const { findByEmail, createUser, getUserDetails } = require("../repositories/auth.repository");
const { generateToken } = require("../utils/jwt");

const register = async (fname, lname, email, password, username) => {
    const existingUser = await findByEmail(email);

    if (existingUser) throw new Error("Email already registered, please login to continue!");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser(fname, lname, email, passwordHash, username);

    const token = generateToken(user);

    delete user.role;
    delete user.email;

    return { user, token }; 
};

const login = async (email, password) => {
    const existingUser = await findByEmail(email);

    if (!existingUser) throw new Error("Email doesn't exist, please register to continue!");

    const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash);

    if (!isPasswordValid) throw new Error("Invalid password");

    const user = await getUserDetails(email);

    const token = generateToken(user);

    return { user, token };
};

module.exports = {
    register,
    login
};