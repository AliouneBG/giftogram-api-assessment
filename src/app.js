const express = require("express");

const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.use("/", authRoutes);
app.use("/", messageRoutes);
app.use("/", userRoutes);

module.exports = app;