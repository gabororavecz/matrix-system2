const db = require("../database/db");

function saveTrade(trade) {

    const stmt = db.prepare(`
        INSERT INTO trades (
            timestamp,
            asset,
            action,
            confidence,
            rsi,
            trend,
            macd,
            atr,
            volume,
            consensusStrength,
            avgConfidence,
            finalTrade
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        new Date().toISOString(),
        trade.asset,
        trade.action,
        trade.confidence,
        trade.rsi,
        trade.trend,
        JSON.stringify(trade.macd),
        trade.atr,
        trade.volume,
        trade.consensusStrength,
        trade.avgConfidence,
        trade.finalTrade
    );
}

module.exports = {
    saveTrade
};