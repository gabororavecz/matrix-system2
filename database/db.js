const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "trades.db"));

// Create table if not exists
db.prepare(`
CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,

    asset TEXT,
    action TEXT,

    confidence REAL,
    rsi REAL,
    trend TEXT,
    macd TEXT,
    atr REAL,
    volume REAL,

    consensusStrength REAL,
    avgConfidence REAL,

    finalTrade TEXT,

    result TEXT,
    entryPrice REAL,
    exitPrice REAL,
    futureReturn REAL
)
`).run();

module.exports = db;