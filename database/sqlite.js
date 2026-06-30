const Database = require("better-sqlite3");

const db = new Database("trades.db");

// Create trades table if it doesn't exist
db.exec(`
CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    createdAt TEXT,

    articleTitle TEXT,
    source TEXT,

    asset TEXT,
    action TEXT,

    price REAL,

    confidence INTEGER,

    sentiment TEXT,

    impact TEXT,

    trend TEXT,

    rsi REAL,

    macd REAL,

    atr REAL,

    avgVolume REAL,

    consensus INTEGER,

    result TEXT
);
`);

module.exports = db;