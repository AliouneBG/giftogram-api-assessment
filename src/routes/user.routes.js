const express = require("express");
const router = express.Router();
const { listUsers } = require("../controllers/user.controller");

router.get("/list_all_users", listUsers);

module.exports = router;