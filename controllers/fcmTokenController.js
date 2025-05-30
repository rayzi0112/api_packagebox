const { registerFcmToken, getFcmToken, testSingleToken } = require("../services/fcmTokenService");

exports.registerToken = async (req, res) => {
    try {
        const { userId, token, skipTest } = req.body;

        if (!userId || !token) {
            return res.status(400).json({
                success: false,
                message: "User ID dan FCM token wajib diisi"
            });
        }

        // Register token first
        const result = await registerFcmToken({ userId, token });

        // Skip test if requested
        if (skipTest) {
            return res.status(201).json({ 
                success: true, 
                data: result,
                message: 'Token registered successfully'
            });
        }

        // Test the token
        try {
            const testResult = await testSingleToken(
                token, 
                'Welcome!', 
                'Your notifications are now active'
            );
            
            res.status(201).json({ 
                success: true, 
                data: result,
                message: 'Token registered and tested successfully',
                testMessageId: testResult.messageId
            });
        } catch (testError) {
            res.status(201).json({ 
                success: true, 
                data: result,
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
        const { userId } = req.params;
        const token = await getFcmToken(userId);
        res.json({ success: true, data: token });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};