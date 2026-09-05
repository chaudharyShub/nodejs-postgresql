const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const { fname, lname, email, password, username } = req.body;

        const result = await authService.register(
            fname,
            lname,
            email,
            password,
            username
        );

        res.status(201).json({
            message: "User registered successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(
            email,
            password
        );

        res.status(200).json({
            message: "Login successful",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};