const express = require("express");
const router = express.Router();
const { createBox, getBoxes } = require("../controllers/boxController");

router.post("/boxes", createBox);
router.get("/boxes", getBoxes);

module.exports = router;