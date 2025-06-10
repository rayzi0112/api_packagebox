const express = require("express");
const router = express.Router();
const { registerToken, getToken } = require("../controllers/fcmTokenController");

router.post("/fcm-tokens/register", registerToken);
router.get("/fcm-tokens/token", getToken);

module.exports = router;
