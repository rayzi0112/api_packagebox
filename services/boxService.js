const { db } = require("../firebase/firebase");
const { sendNotificationToAllDevices } = require("../services/fcmTokenService");

async function addBoxMasuk(data) {  
  const boxRef = db.ref("boxes_masuk").push();
  await boxRef.set({ ...data, type: "masuk" });
  // Kirim notifikasi ke semua device
  await sendNotificationToAllDevices(
    "Notifikasi Paket Masuk",
    `Silakan ambil paket Anda`,
    null,
    "masuk"
  );
  return { id: boxRef.key, ...data, type: "masuk" };
}

async function addBoxGetar(data) {
  const boxRef = db.ref("boxes_getar").push();
  await boxRef.set({ ...data, type: "getar" });
  // Kirim notifikasi ke semua device
  await sendNotificationToAllDevices(
    "Notifikasi Box Dibobol",
    `Box Anda Dibobol! Silakan cek segera`,
    null,
    "getar"
  );
  return { id: boxRef.key, ...data, type: "getar" };
}

async function getAllBoxesByType(type) {
  let ref = "boxes_masuk";
  if (type === "getar") ref = "boxes_getar";
  const snapshot = await db.ref(ref).once("value");
  const boxes = [];
  snapshot.forEach((child) => {
    boxes.push({ id: child.key, ...child.val() });
  });
  // Sort berdasarkan Firebase key secara descending (terbaru di atas)
  boxes.sort((a, b) => b.id.localeCompare(a.id));
  return boxes;
}

async function getAllBoxes() {
  const [masukSnap, getarSnap] = await Promise.all([
    db.ref("boxes_masuk").once("value"),
    db.ref("boxes_getar").once("value"),
  ]);
  const boxes = [];
  masukSnap.forEach((child) => {
    boxes.push({ id: child.key, ...child.val() });
  });
  getarSnap.forEach((child) => {
    boxes.push({ id: child.key, ...child.val() });
  });
  // Sort berdasarkan Firebase key (yang berisi timestamp) secara descending
  // sehingga data terbaru di atas
  boxes.sort((a, b) => b.id.localeCompare(a.id));
  return boxes;
}


async function deleteAllBoxes() {
  await db.ref("boxes_masuk").remove();
  await db.ref("boxes_getar").remove();
}


module.exports = { addBoxMasuk, addBoxGetar, getAllBoxesByType, getAllBoxes,deleteAllBoxes };
