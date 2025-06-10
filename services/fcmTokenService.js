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

module.exports = { registerFcmToken, getFcmToken, testSingleToken };