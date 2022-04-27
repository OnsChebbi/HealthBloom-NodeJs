const express = require("express");
const router = express.Router();
const {
  accessChat,
  fetchChats,
} = require("../../controllers/chat/chatController");

router.post("/", accessChat);
router.get("/", fetchChats);
module.exports = router;
