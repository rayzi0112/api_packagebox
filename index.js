require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/boxRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
