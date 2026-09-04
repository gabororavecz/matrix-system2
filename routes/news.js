const express = require("express");
const router = express.Router();

const {
    buildTradeSetup
} = require("../services/tradeSetupService");

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

const {
    filterTrades
} = require("../services/filterService");

const {
    buildConsensus
} = require("../services/consensusService");


router.get("/", async (req, res) => {

    try {

        console.log("Fetching news...");

        const articles = await fetchNews();

        const allTrades = [];


        // =====================================================
        // ANALYSE NEWS ARTICLES
        // =====================================================

        for (const article of articles) {

            const text =
                `${article.title || ""} ${article.description || ""}`;

            const sentiment = analyzeSentiment(text);
            const impact = detectImpact(text);
            const assets = detectAssets(text);


            // =================================================
            // ANALYSE EACH ASSET
            // =================================================

            for (const asset of assets) {

                console.log("Analysing:", asset);


                // =============================================
                // NEWS -> TRADE DIRECTION
                // =============================================

                const finalTrade =
                    mapToTrade(asset, sentiment);

                if (finalTrade === "NO TRADE") {

                    console.log(
                        "No trade from sentiment:",
                        asset,
                        sentiment
                    );

                    continue;
                }


                // =============================================
                // MARKET DATA
                // =============================================

                const data =
                    await getMarketData(asset);

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


                // =============================================
                // TECHNICAL INDICATORS
                // =============================================

                const rsi =
                    getRSI(data);

                const trend =
                    getTrend(data);

                const macd =
                    getMACD(data);

                const atr =
                    getATR(data);

                const volume =
                    getAverageVolume(data);


                // =============================================
                // ACTION
                // =============================================

                const action =
                    finalTrade.startsWith("BUY")
                        ? "BUY"
                        : "SELL";


                // =============================================
                // SOURCE / FRESHNESS
                // =============================================

                const sourceWeight =
                    getSourceWeight(
                        article.source?.name
                    );

                const freshnessWeight =
                    getFreshnessWeight(
                        article.publishedAt
                    );


                // =============================================
                // CONFIDENCE
                // =============================================

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


                // =============================================
                // DEBUG
                // =============================================

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


                // =============================================
                // CREATE TRADE
                // =============================================

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


                // =============================================
                // ADD TRADE
                // =============================================

                allTrades.push(trade);

                console.log(
                    "Trade added:",
                    finalTrade,
                    "Confidence:",
                    confidence
                );

            }
        }


        // =====================================================
        // BEFORE FILTER
        // =====================================================

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


        // =====================================================
        // FILTER
        // =====================================================

        const filtered =
            filterTrades(allTrades);

        console.log(
            "Trades after filtering:",
            filtered.length
        );


        // =====================================================
        // CONSENSUS
        // =====================================================

        const consensus =
            buildConsensus(filtered);

        console.log("Consensus:");

        console.log(
            JSON.stringify(
                consensus,
                null,
                2
            )
        );


        // =====================================================
        // BEST TRADE
        // =====================================================

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


        // =====================================================
        // RESPONSE
        // =====================================================

        res.json({

            analysed:
                articles.length,

            filtered:
                filtered.length,

            allTrades:
                filtered,

            consensus,

            decision:
                consensus.length
                    ? consensus[0]
                    : bestTrade

        });

    }


    // =========================================================
    // ERROR HANDLING
    // =========================================================

    catch (err) {

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