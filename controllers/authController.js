const { registerUser, loginUser } = require("../services/authService");

register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: "Username, password, dan email wajib diisi." });
    }
    const user = await registerUser({ username, password, email });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username dan password wajib diisi." });
    }
    const user = await loginUser({ username, password });
    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};
