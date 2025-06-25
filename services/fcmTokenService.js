const { db, messaging , admin} = require("../firebase/firebase");

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
        console.log('Starting notification send process...');
        
        const snapshot = await db.ref('fcm_tokens').once('value');
        const tokenData = [];
        const validTokens = [];

        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            if (data && data.token && data.isActive !== false) {
                tokenData.push(data);
                validTokens.push(data.token);
            }
        });

        if (validTokens.length === 0) {
            console.log('No valid device tokens available');
            return { success: false, message: 'No device tokens available' };
        }

        console.log(`Found ${validTokens.length} valid tokens`);

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
            },
            android: {
                notification: {
                    priority: 'high',
                    channel_id: 'packagebox_channel',
                    sound: 'default'
                },
                priority: 'high',
                ttl: 3600000
            },
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: title,
                            body: body
                        },
                        sound: 'default',
                        badge: 1,
                        'mutable-content': 1,
                        'content-available': 1
                    }
                }
            }
        };
        
        const BATCH_SIZE = 100; 
        let successCount = 0;
        let failedCount = 0;
        const invalidTokens = [];
        const errors = [];

        for (let i = 0; i < validTokens.length; i += BATCH_SIZE) {
            const batch = validTokens.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(validTokens.length/BATCH_SIZE)}`);
            
            try {
                const messages = batch.map(token => ({
                    token: token,
                    ...message
                }));

                const response = await admin.messaging().sendEach(messages);
                
                response.responses.forEach((resp, index) => {
                    if (resp.success) {
                        successCount++;
                    } else {
                        failedCount++;
                        const error = resp.error;
                        const failedToken = batch[index];
                        
                        console.log(`Failed to send to token: ${failedToken}`);
                        console.log(`Error: ${error.code} - ${error.message}`);
                        
                        if (error.code === 'messaging/invalid-registration-token' || 
                            error.code === 'messaging/registration-token-not-registered') {
                            invalidTokens.push(failedToken);
                        }
                        
                        errors.push({
                            token: failedToken,
                            error: error.code,
                            message: error.message
                        });
                    }
                });

                if (i + BATCH_SIZE < validTokens.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

            } catch (batchError) {
                console.error(`Error processing batch starting at index ${i}:`, batchError);
                failedCount += batch.length;
                errors.push({
                    batch: i,
                    error: batchError.code || 'unknown',
                    message: batchError.message
                });
            }
        }

        // Jika ingin hapus token tidak valid, aktifkan fungsi ini dan buat cleanupInvalidTokens
        // if (invalidTokens.length > 0) {
        //     console.log(`Cleaning up ${invalidTokens.length} invalid tokens`);
        //     await exports.cleanupInvalidTokens(invalidTokens);
        // }

        const result = {
            success: successCount > 0,
            total: validTokens.length,
            sent: successCount,
            failed: failedCount,
            invalidTokensRemoved: invalidTokens.length
        };

        console.log('Notification send completed:', result);

        if (errors.length > 0) {
            console.log('Errors encountered:', errors);
        }

        return result;

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
