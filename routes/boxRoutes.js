const express = require("express");
const router = express.Router();
const { createBox, getBoxes } = require("../controllers/boxController");
const { deleteAllBoxes } = require("../services/boxService");

router.post("/boxes", createBox);
router.get("/boxes", getBoxes);

router.delete("/deleteboxes", async (req, res) => {
    try {
        await deleteAllBoxes();
        res.json({ success: true, message: "Semua data box berhasil dihapus." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;