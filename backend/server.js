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

app.get("/tasks", (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.status(200).json(rows);
    });
});


app.post("/tasks", (req, res) => {
    const { text } = req.body;
    db.run(
        `INSERT INTO todos
         (text, completed, isEditing)
         VALUES (?, ?, ?)`,
        [text, false, false],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                id: this.lastID,
                text,
                completed: false,
                isEditing: false
            });
        }
    );
});


app.put("/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const { text, isEditing, completed } = req.body;

    db.run(
        "UPDATE todos SET text = ?, isEditing = ?, completed = ? WHERE id = ?",
        [text, isEditing, completed, taskId],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({
                success: true,
                rowsUpdated: this.changes
            });
        }
    );
});

app.delete("/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    db.run("DELETE FROM todos WHERE id = ?", taskId);

    res.send("Task deleted successfully");
});



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
