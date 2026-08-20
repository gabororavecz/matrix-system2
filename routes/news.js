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

const { filterTrades } = require("../services/filterService");

const {
    RSI,
    SMA,
    MACD,
    ATR
} = require("technicalindicators");

router.get("/", async (req, res) => {

    try {

        console.log("Fetching news...");

        const articles = await fetchNews();

        const allTrades = [];

        for (const article of articles) {

            const text =
                (article.title || "") +
                " " +
                (article.description || "");

            const sentiment = analyzeSentiment(text);
            const impact = detectImpact(text);
            const assets = detectAssets(text);

            for (const asset of assets) {

                console.log("Analysing:", asset);

                const finalTrade = mapToTrade(asset, sentiment);

                if (finalTrade === "NO TRADE")
                    continue;

                const data = await getMarketData(asset);

                console.log(asset, "candles:", data.length);

                if (!data.length)
                    continue;

                const rsi = getRSI(data);
                const trend = getTrend(data);
                const macd = getMACD(data);
                const atr = getATR(data);
                const volume = getAverageVolume(data);

                const action =
                    finalTrade.startsWith("BUY")
                        ? "BUY"
                        : "SELL";

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

                console.log({
    asset,
    sentiment,
    impact,
    rsi,
    trend,
    macd,
    atr,
    volume,
    confidence
});

                allTrades.push({

                    asset,

                    action,

                    finalTrade,

                    confidence,

                    sentiment,

                    impact,

                    trend,

                    rsi,

                    macd,

                    atr,

                    volume,

                    headline: article.title

                });

                console.log("Trade added:", finalTrade, confidence);

            }

        }

        console.log("Total trades before filtering:", allTrades.length);

console.log(JSON.stringify(allTrades, null, 2));

        const filtered = filterTrades(allTrades);

        console.log("Trades found:", filtered.length);

        res.json({

            analysed: articles.length,

            filtered: filtered.length,

            allTrades: filtered,

            decision: filtered.length ? filtered[0] : null

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: "news route failed",

            message: err.message

        });

    }

});

module.exports = router;