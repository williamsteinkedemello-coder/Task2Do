const sqlite3 = require('sqlite3').verbose();

//create new dabatase file

const db = new sqlite3.Database('./backend/database.db', (err) => {
    if (err) {
        return console.log(err.message)
    }
    console.log('Connected to SQLite database');

});

//execute SQL code here
db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    isEditing INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

module.exports = db;