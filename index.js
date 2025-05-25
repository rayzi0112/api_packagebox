require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
  res.send("Api backedn for box by Telecomunication engineering 21");
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/boxRoutes"));
const fcmTokenRoutes = require("./routes/fcmTokenRoutes");
app.use("/api", fcmTokenRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
