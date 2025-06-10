const { registerFcmToken, getFcmToken, testSingleToken } = require("../services/fcmTokenService");

exports.registerToken = async (req, res) => {
    try {
        const { token, skipTest } = req.body;
        console.log('Registering token:', token);
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "FCM token wajib diisi"
            });
        }

        // Register token first
        const result = await registerFcmToken({ token });

        // Skip test if requested
        if (skipTest) {
            return res.status(201).json({ 
                success: true, 
                message: 'Token registered successfully'
            });
        }

        // Test the token
        try {
            const testResult = await testSingleToken(
                token, 
                'Welcome to SmartBox', 
                'Notifikasi anda berhasil aktif'
            );
            
            res.status(201).json({ 
                success: true, 
                message: 'Token registered and tested successfully',
                testMessageId: testResult.messageId
            });
        } catch (testError) {
            res.status(201).json({ 
                success: true, 
                message: 'Token registered but test failed',
                testError: testError.message
            });
        }
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getToken = async (req, res) => {
    try {
        const token = await getFcmToken();
        res.json({ success: true, data: token });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};
