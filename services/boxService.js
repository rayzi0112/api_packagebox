const { db } = require("../firebase/firebase");
const { sendNotificationToAllDevices } = require("./fcmTokenService");

async function addBox(data, type) {
  const boxRef = db.ref("boxes").push();
  await boxRef.set({ ...data, type });

  if (type === "masuk") {
    await sendNotificationToAllDevices(
      "Notifikasi Paket Masuk",
      "Silakan ambil paket Anda",
      null,
      "masuk"
    );
  } else if (type === "getar") {
    await sendNotificationToAllDevices(
      "Notifikasi Box Dibobol",
      "Box Anda Dibobol! Silakan cek segera",
      null,
      "getar"
    );
  }

  return { id: boxRef.key, ...data, type };
}

async function getAllBoxes() {
  const snapshot = await db.ref("boxes").once("value");
  const boxes = [];
  snapshot.forEach((child) => {
    boxes.push({ id: child.key, ...child.val() });
  });
  boxes.sort((a, b) => b.id.localeCompare(a.id));
  return boxes;
}

async function getAllBoxesByType(type) {
  const snapshot = await db.ref("boxes").once("value");
  const boxes = [];
  snapshot.forEach((child) => {
    const box = child.val();
    if (box.type === type) {
      boxes.push({ id: child.key, ...box });
    }
  });
  boxes.sort((a, b) => b.id.localeCompare(a.id));
  return boxes;
}

async function deleteAllBoxes() {
  await db.ref("boxes").remove();
}

module.exports = {
  addBox,
  getAllBoxes,
  getAllBoxesByType,
  deleteAllBoxes
};
