const { addBoxMasuk, addBoxGetar, getAllBoxes } = require("../services/boxService");

exports.createBox = async (req, res) => {
  try {
    const { type, ...data } = req.body;
    let box;
    if (type === "masuk") {
      box = await addBoxMasuk(data);
    } else if (type === "getar") {
      box = await addBoxGetar(data);
    } else {
      return res.status(400).json({ success: false, message: "Type harus 'masuk' atau 'getar'." });
    }
    res.status(201).json({ success: true, box });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getBoxes = async (req, res) => {
  try {
    const boxes = await getAllBoxes();
    res.json({ success: true, boxes });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

