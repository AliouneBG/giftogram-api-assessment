const express = require("express");
const router = express.Router();
const { sendMessage, viewMessages } = require("../controllers/message.controller");

router.post("/send_message", sendMessage);
router.get("/view_messages", viewMessages);

module.exports = router;