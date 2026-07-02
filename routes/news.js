const express = require("express");
const router = express.Router();

const {
    fetchNews,
    getSourceWeight,
    getFreshnessWeight
} = require("../services/newsService");

const {
    analyzeSentiment,
    detectAssets,
    detectImpact,
    mapToTrade
} = require("../services/sentimentService");

const {
    calculateConfidence
} = require("../services/scoringService");

const {
    getMarketData,
    getRSI,
    getTrend,
    getMACD,
    getATR,
    getAverageVolume
} = require("../services/marketService");

router.get("/", async (req, res) => {

    try {

        // =========================
        // 1. GET NEWS
        // =========================
        const articles = await fetchNews();

        const allTrades = [];

        // =========================
        // 2. LOOP ARTICLES
        // =========================
        for (const article of articles) {

            const text =
                (article.title || "") +
                " " +
                (article.description || "");

            const sentiment = analyzeSentiment(text);
            const impact = detectImpact(text);
            const assets = detectAssets(text);

            const uniqueAssets = [...new Set(assets)];

            for (let asset of uniqueAssets) {

                const baseTrade = mapToTrade(asset, sentiment);

                if (baseTrade === "NO TRADE")
                    continue;

                const data = await getMarketData(asset);

                if (!data || data.length === 0)
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

                const finalTrade = baseTrade; // (keep simple for now)

                const confidence = calculateConfidence({
                    sentiment,
                    impact,
                    rsi,
                    trend,
                    macd,
                    atr,
                    volume,
                    sourceWeight: getSourceWeight(article.source?.name),
                    freshnessWeight: getFreshnessWeight(article.publishedAt)
                });

                const { filterTrades } = require("../services/filterService");

                const allTradesFlat = filterTrades(
                    analyzed.flatMap(a => a.trades)
                );

                const allTradesFlat = analyzed.flatMap(a => a.trades);

                const { buildConsensus } = require("../services/consensusService");

                const { executionDecision } = require("../services/executionService");

                const decision = executionDecision(consensus.bestConsensus);

                const { saveTrade } = require("../services/tradeService");

                saveTrade(consensus.bestConsensus);

                allTrades.push({
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
        }

        // =========================
        // RESPONSE
        // =========================
       res.json({
    bestConsensus: consensus.bestConsensus,
    allConsensus: consensus.allConsensus,
    consensus,
    decision
});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "news route failed" });
    }
});

module.exports = router;