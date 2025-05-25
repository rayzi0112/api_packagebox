const express = require("express");
const router = express.Router();
const { registerToken, getToken } = require("../controllers/fcmTokenController");

router.post("/fcm-tokens", registerToken);
router.get("/fcm-tokens/:userId", getToken);

module.exports = router;