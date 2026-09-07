const express = require("express");
const cors = require('cors');

const app = express();

const authRoutes = require("./routes/auth.routes");
const profileRoute = require("./routes/profile.routes");
const postsRoute = require("./routes/posts.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);

app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);

module.exports = app;
