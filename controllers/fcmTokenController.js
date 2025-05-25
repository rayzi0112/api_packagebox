const { registerFcmToken, getFcmToken } = require("../services/fcmTokenService");

exports.registerToken = async (req, res) => {
    try {
        const { userId, token } = req.body;

        if (!userId || !token) {
            return res.status(400).json({
                success: false,
                message: "User ID dan FCM token wajib diisi"
            });
        }

        const result = await registerFcmToken({ userId, token });
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getToken = async (req, res) => {
    try {
        const { userId } = req.params;
        const token = await getFcmToken(userId);
        res.json({ success: true, data: token });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};