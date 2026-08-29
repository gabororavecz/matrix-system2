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

router.get("/", async (req, res) => {

    try {

        console.log("Fetching news...");

        const articles = await fetchNews();

        const allTrades = [];

        // ==========================================
        // ANALYSE EVERY NEWS ARTICLE
        // ==========================================

        for (const article of articles) {

            const text =
                (article.title || "") +
                " " +
                (article.description || "");

            const sentiment = analyzeSentiment(text);
            const impact = detectImpact(text);
            const assets = detectAssets(text);

            // ==========================================
            // ANALYSE EVERY ASSET FOUND IN THE ARTICLE
            // ==========================================

            for (const asset of assets) {

                console.log("Analysing:", asset);

                // ------------------------------------------
                // 1. NEWS -> BUY / SELL
                // ------------------------------------------

                const finalTrade = mapToTrade(
                    asset,
                    sentiment
                );

                if (finalTrade === "NO TRADE") {
                    console.log(
                        "No trade from sentiment:",
                        asset,
                        sentiment
                    );

                    continue;
                }

                // ------------------------------------------
                // 2. GET MARKET DATA
                // ------------------------------------------

                const data = await getMarketData(asset);

                console.log(
                    asset,
                    "candles:",
                    data.length
                );

                if (!data.length) {
                    console.log(
                        "Skipping",
                        asset,
                        "- no market data"
                    );

                    continue;
                }

                // ------------------------------------------
                // 3. TECHNICAL INDICATORS
                // ------------------------------------------

                const rsi = getRSI(data);

                const trend = getTrend(data);

                const macd = getMACD(data);

                const atr = getATR(data);

                const volume = getAverageVolume(data);

                // ------------------------------------------
                // 4. DETERMINE ACTION
                // ------------------------------------------

                const action =
                    finalTrade.startsWith("BUY")
                        ? "BUY"
                        : "SELL";

                // ------------------------------------------
                // 5. SOURCE + FRESHNESS
                // ------------------------------------------

                const sourceWeight =
                    getSourceWeight(
                        article.source?.name
                    );

                const freshnessWeight =
                    getFreshnessWeight(
                        article.publishedAt
                    );

                // ------------------------------------------
                // 6. CALCULATE CONFIDENCE
                // ------------------------------------------

                const confidence =
                    calculateConfidence({

                        action,

                        sentiment,

                        impact,

                        rsi,

                        trend,

                        macd,

                        atr,

                        volume,

                        sourceWeight,

                        freshnessWeight

                    });

                // ------------------------------------------
                // DEBUG
                // ------------------------------------------

                console.log({
                    asset,
                    action,
                    finalTrade,
                    sentiment,
                    impact,
                    rsi,
                    trend,
                    macd,
                    atr,
                    volume,
                    sourceWeight,
                    freshnessWeight,
                    confidence
                });

                // ------------------------------------------
                // 7. CREATE TRADE
                // ------------------------------------------

                const trade = {

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

                    sourceWeight,

                    freshnessWeight,

                    headline:
                        article.title || "",

                    publishedAt:
                        article.publishedAt || null,

                    source:
                        article.source?.name || "Unknown"

                };

                // ------------------------------------------
                // 8. ADD TRADE TO ARRAY
                // ------------------------------------------

                allTrades.push(trade);

                console.log(
                    "Trade added:",
                    finalTrade,
                    "Confidence:",
                    confidence
                );

            }
        }

        // ==========================================
        // BEFORE FILTER
        // ==========================================

        console.log(
            "Total trades before filtering:",
            allTrades.length
        );

        console.log(
            JSON.stringify(
                allTrades,
                null,
                2
            )
        );

        // ==========================================
        // FILTER TRADES
        // ==========================================

        const filtered =
            filterTrades(allTrades);

        console.log(
            "Trades found:",
            filtered.length
        );

        // ==========================================
        // BEST TRADE
        // ==========================================

        const bestTrade =
            filtered.length > 0
                ? filtered.reduce(
                    (best, trade) =>
                        trade.confidence >
                        best.confidence
                            ? trade
                            : best
                )
                : null;

        // ==========================================
        // RESPONSE
        // ==========================================

        res.json({

            analysed:
                articles.length,

            totalTrades:
                allTrades.length,

            filtered:
                filtered.length,

            allTrades:
                filtered,

            decision:
                bestTrade

        });

    } catch (err) {

        console.error(
            "NEWS ROUTE ERROR:",
            err
        );

        res.status(500).json({

            error:
                "news route failed",

            message:
                err.message

        });

    }

});

module.exports = router;