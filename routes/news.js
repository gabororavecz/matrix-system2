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
    fetchDaily,
    getRSI,
    getTrend,
    getMACD,
    getATR,
    getAverageVolume
} = require("../services/marketService");

const {
    calculateConfidence
} = require("../services/scoringService");

const {
        
} = require("../services/filterService");

const {
    buildConsensus
} = require("../services/consensusService");

const {
    executionDecision
} = require("../services/executionService");

const {
    saveTrade
} = require("../services/tradeService");


router.get("/", async (req, res) => {

    try {

        console.log("Fetching news...");

        const articles = await fetchNews();

        const analysedTrades = [];


        for (const article of articles) {


            const text =
                `${article.title || ""} ${article.description || ""}`;


            const sentiment = analyzeSentiment(text);

            console.log(
    "SENTIMENT:",
    sentiment,
    "TEXT:",
    text.substring(0,100)
);

            const impact = detectImpact(text);

            const assets = detectAssets(text);


            for (const asset of [...new Set(assets)]) {


                const baseTrade = mapToTrade(
                    asset,
                    sentiment
                );


                if (baseTrade === "NO TRADE") {
                    continue;
                }


                console.log(
                    asset,
                    sentiment,
                    baseTrade
                );


                const marketData = await fetchDaily(asset);


                if (!marketData || marketData.length === 0) {

                    console.log(
        "NO MARKET DATA:",
        asset
    );
                    continue;
                }


                const rsi = getRSI(marketData);

                const trend = getTrend(marketData);

                const macd = getMACD(marketData);

                const atr = getATR(marketData);

                const volume = getAverageVolume(marketData);



                const confidence = calculateConfidence({

                    sentiment,

                    impact,

                    rsi,

                    trend,

                    macd,

                    atr,

                    volume,

                    sourceWeight:
                        getSourceWeight(
                            article.source?.name
                        ),

                    freshnessWeight:
                        getFreshnessWeight(
                            article.publishedAt
                        )
                });



                analysedTrades.push({

                    asset,

                    action:
                        baseTrade.includes("BUY")
                            ? "BUY"
                            : "SELL",

                    confidence,

                    sentiment,

                    impact,

                    trend,

                    rsi,

                    macd,

                    atr,

                    volume,

                    article:
                        article.title

                });


            }

        }



        console.log(
            "Trades found:",
            analysedTrades.length
        );



      const filteredTrades = analysedTrades;


        const consensus =
            buildConsensus(
                filteredTrades
            );



        let decision = null;


        if (consensus.bestConsensus) {

            decision =
                executionDecision(
                    consensus.bestConsensus
                );


            saveTrade(
                consensus.bestConsensus
            );

        }



        res.json({

            analysed:
                analysedTrades.length,

            filtered:
                filteredTrades.length,

            bestTrade:
                consensus.bestConsensus,

            allTrades:
                filteredTrades,

            decision

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