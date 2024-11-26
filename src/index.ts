import express from "express";

const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
  res.json({ test: "test response" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
