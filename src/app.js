const express = require("express");

const app = express();

const authRoutes = require("./routes/auth.routes");
const profileRoute = require("./routes/profile.routes");
const authenticate = require("./middlewares/authenticate.middlewares");
// const feedRoute = require("./routes/feed.routes");

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);

app.use('/api/profile', authenticate, profileRoute);
// app.use('/api/feed', feedRoute);

module.exports = app;
