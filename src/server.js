require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

pool
    .query("SELECT * from users")
    .then(() => {
        console.log("PostgreSQL connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("PostgreSQL connection failed:", error);
    });