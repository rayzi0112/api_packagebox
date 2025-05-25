const { db } = require("../firebase/firebase");

async function registerFcmToken({ userId, token }) {
    const tokenRef = db.ref("fcm_tokens");

    // Store token with userId as key
    await tokenRef.child(userId).set({
        token: token,
        updatedAt: new Date().toISOString()
    });

    return { userId, token };
}

async function getFcmToken(userId) {
    const tokenRef = db.ref("fcm_tokens");
    const snapshot = await tokenRef.child(userId).once("value");

    if (!snapshot.exists()) {
        throw new Error("FCM token not found for user");
    }

    return snapshot.val();
}

module.exports = { registerFcmToken, getFcmToken };