const { db, messaging } = require("../firebase/firebase");

async function registerFcmToken({ token }) {
    const tokenRef = db.ref("fcm_tokens").push();
    await tokenRef.set({
        token: token,
        updatedAt: new Date().toISOString()
    });
    return { token };
}

async function testSingleToken(token, title = 'Test', body = 'Test notification') {
    try {
        const message = {
            token: token,
            notification: {
                title: title,
                body: body
            },
            data: {
                type: 'welcome',
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                id: Date.now().toString(),
                timestamp: new Date().toISOString()
            },
            android: {
                notification: {
                    priority: 'high',
                    channel_id: 'packagebox_channel',
                    sound: 'default'
                },
                priority: 'high'
            },
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: title,
                            body: body
                        },
                        sound: 'default'
                    }
                }
            }
        };

        const response = await messaging.send(message);
        console.log('Test notification sent successfully:', response);
        return { success: true, messageId: response };
    } catch (error) {
        console.error('Test notification failed:', error);
        return { success: false, error: error.message };
    }
}

async function getFcmToken() {
    const tokenRef = db.ref("fcm_tokens");
    const snapshot = await tokenRef.once("value");
    
    if (!snapshot.exists()) {
        throw new Error("No FCM tokens found");
    }
    
    return snapshot.val();
}

async function sendNotificationToAllDevices(title, body, type) {
    try {
        const snapshot = await db.ref('fcm_tokens').once('value');
        const validTokens = [];

        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            if (data && data.token && data.isActive !== false) {
                validTokens.push(data.token);
            }
        });

        if (validTokens.length === 0) {
            return { success: false, message: 'No device tokens available' };
        }

        const message = {
            notification: {
                title: title,
                body: body
            },
            data: {
                type: type,
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                id: Date.now().toString(),
                timestamp: new Date().toISOString()
            }
        };

        // Kirim notifikasi ke semua token
        const response = await messaging.sendMulticast({
            ...message,
            tokens: validTokens
        });

        console.log('Notification send completed:', response);

        return {
            success: response.successCount > 0,
            sent: response.successCount,
            failed: response.failureCount,
            responses: response.responses
        };
    } catch (error) {
        console.error('Error in sendNotificationToAllDevices:', error);
        throw error;
    }
}

module.exports = { 
    registerFcmToken, 
    getFcmToken, 
    testSingleToken,
    sendNotificationToAllDevices // Export fungsi baru
};
