const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {

    const trades = db.prepare(`
        SELECT * FROM trades
        ORDER BY timestamp DESC
    `).all();

    const results = {
        total: trades.length,
        wins: 0,
        losses: 0
    };

    for (const t of trades) {

        // simplistic placeholder logic (we refine later)
        if (t.result === "WIN") results.wins++;
        if (t.result === "LOSS") results.losses++;
    }

    const winRate = results.total
        ? (results.wins / results.total) * 100
        : 0;

    res.json({
        totalTrades: results.total,
        wins: results.wins,
        losses: results.losses,
        winRate: winRate.toFixed(2) + "%"
    });
});

module.exports = router;