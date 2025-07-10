const { addBox, getAllBoxes, getAllBoxesByType } = require("../services/boxService");

exports.createBox = async (req, res) => {
  try {
    const { type, ...data } = req.body;
    if (type !== "masuk" && type !== "getar") {
      return res.status(400).json({ success: false, message: "Type harus 'masuk' atau 'getar'." });
    }

    const box = await addBox(data, type);
    res.status(201).json({ success: true, box });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getBoxes = async (req, res) => {
  try {
    const { type } = req.query;
    const boxes = type ? await getAllBoxesByType(type) : await getAllBoxes();
    res.json({ success: true, boxes });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
  