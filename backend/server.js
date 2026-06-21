const express = require("express");
const path = require("path");
const db = require("./db/database");
const app = express();
const PORT = 3000;

// Middleware to parse JSON data 
app.use(express.json());

//serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
