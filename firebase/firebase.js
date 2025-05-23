const admin = require("firebase-admin");
const { getDatabase } = require("firebase-admin/database");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://packagebox-37ca4-default-rtdb.firebaseio.com/",
});

const db = getDatabase();
const messaging = admin.messaging();

module.exports = { db, messaging };
