const express = require("express");
var cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;

// Init Middleware
app.use(cors());

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("Hello!"));

app.listen(PORT, () => {
  console.log(`port ${PORT}`);
});
