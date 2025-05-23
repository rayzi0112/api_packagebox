const { db, messaging } = require("../firebase/firebase");

async function addBoxMasuk(data) {
  const boxRef = db.ref("boxes_masuk").push();
  await boxRef.set({ ...data, type: "masuk" });

  // Notifikasi paket masuk
  const message = {
    notification: {
      title: "Paket Masuk",
      body: `Box baru: ${data.name}`,
    },
    topic: "box_masuk",
  };
  await messaging.send(message);
  return { id: boxRef.key, ...data, type: "masuk" };
}

async function addBoxGetar(data) {
  const boxRef = db.ref("boxes_getar").push();
  await boxRef.set({ ...data, type: "getar" });

  // Notifikasi paket bergetar
  const message = {
    notification: {
      title: "Paket Bergetar",
      body: `Box bergetar: ${data.name}`,
    },
    topic: "box_getar",
  };
  await messaging.send(message);
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
  return boxes;
}

module.exports = { addBoxMasuk, addBoxGetar, getAllBoxesByType };
