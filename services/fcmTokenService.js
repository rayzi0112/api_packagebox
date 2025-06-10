const { db, messaging } = require("../firebase/firebase");

async function registerFcmToken({ token }) {
    const tokenRef = db.ref("fcm_tokens").push();
    await tokenRef.set({
        token: token,
        updatedAt: new Date().toISOString()
    });
    return { token };
}

async function testSingleToken(token, title, body) {
    const message = {
        token: token,
        notification: {
            title: title,
            body: body
        }
    };

    const response = await messaging.send(message);
    return { messageId: response };
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