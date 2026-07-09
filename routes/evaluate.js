const db = require("../database/db");
const {
    getFuturePrice,
    evaluateTrade
} = require("../services/backtestService");

router.get("/", async (req, res) => {

    const trades = db.prepare(`
        SELECT * FROM trades
        ORDER BY timestamp DESC
        LIMIT 50
    `).all();

    let wins = 0;
    let losses = 0;

    for (const trade of trades) {

        const priceData = await getFuturePrice(trade.asset);

        if (!priceData) continue;

        const result = evaluateTrade(
            trade.action,
            priceData.current,
            priceData.future
        );

        if (result === "WIN") wins++;
        if (result === "LOSS") losses++;

        db.prepare(`
            UPDATE trades
            SET result = ?
            WHERE id = ?
        `).run(result, trade.id);
    }

    const total = wins + losses;

    res.json({
        total,
        wins,
        losses,
        winRate: total ? ((wins / total) * 100).toFixed(2) : "0"
    });
});

router.get("/all", (req, res) => {

    const trades = db.prepare(`
        SELECT *
        FROM trades
        ORDER BY id DESC
    `).all();

    res.json(trades);

});