const { db } = require("../firebase/firebase");
const bcrypt = require("bcrypt");

async function registerUser({ username, password, email }) {
  const usersRef = db.ref("users");
  const snapshot = await usersRef.orderByChild("username").equalTo(username).once("value");

  if (snapshot.exists()) throw new Error("Username already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserRef = usersRef.push();
  await newUserRef.set({ username, password: hashedPassword, email });

  return { id: newUserRef.key, username, email };
}

async function loginUser({ username, password }) {
  const usersRef = db.ref("users");
  const snapshot = await usersRef.orderByChild("username").equalTo(username).once("value");

  if (!snapshot.exists()) throw new Error("User not found");

  const user = Object.values(snapshot.val())[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid password");

  return { username, email: user.email };
}

module.exports = { registerUser, loginUser };
