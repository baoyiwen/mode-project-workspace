import express from "express";

const app = express();

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from server" });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
