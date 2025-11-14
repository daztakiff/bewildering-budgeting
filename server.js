const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Use __dirname directly (available in CommonJS)
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/papaparse",
  express.static(path.resolve("node_modules/papaparse"))
);

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from your Express backend!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
