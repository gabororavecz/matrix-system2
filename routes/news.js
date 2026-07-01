const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "News route working"
    });
});

module.exports = router;

for (let asset of uniqueAssets) {

    const baseTrade = mapToTrade(asset, sentiment);

    if (baseTrade === "NO TRADE")
        continue;

    const data = await fetchDaily(asset);

    if (!data)
        continue;

    const rsi = getRSI(data);

    const trend = getTrend(data);

    const macd = getMACD(data);

    const atr = getATR(data);

    const volume = getAverageVolume(data);

    const action =
        baseTrade.includes("BUY")
            ? "BUY"
            : "SELL";

    const finalTrade =
        filterTrade(baseTrade, rsi);

    const confidence =
        calculateConfidence(...);

    trades.push({
        asset,
        action,
        trend,
        rsi,
        macd,
        atr,
        volume,
        confidence,
        finalTrade
    });

}