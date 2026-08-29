const {
    calculateConfidence
} = require("./services/scoringService");


const tests = [

    {
        name: "Strong BUY confluence",

        action: "BUY",

        sentiment: "STRONG_BULLISH",

        impact: "HIGH",

        rsi: 58,

        trend: "BULLISH",

        macd: {
            MACD: 2,
            signal: 1,
            histogram: 1
        },

        atr: 2,

        volume: 1000000,

        sourceWeight: 1,

        freshnessWeight: 1
    },


    {
        name: "Weak BUY - bearish trend",

        action: "BUY",

        sentiment: "BULLISH",

        impact: "MEDIUM",

        rsi: 68,

        trend: "BEARISH",

        macd: {
            MACD: -1,
            signal: 1,
            histogram: -2
        },

        atr: 2,

        volume: 0,

        sourceWeight: 1,

        freshnessWeight: 1
    },


    {
        name: "Strong SELL confluence",

        action: "SELL",

        sentiment: "STRONG_BEARISH",

        impact: "HIGH",

        rsi: 38,

        trend: "BEARISH",

        macd: {
            MACD: -2,
            signal: -1,
            histogram: -1
        },

        atr: 2,

        volume: 1000000,

        sourceWeight: 1,

        freshnessWeight: 1
    }

];


for (const test of tests) {

    const confidence = calculateConfidence(test);

    console.log("\n==============================");

    console.log(test.name);

    console.log("Action:", test.action);

    console.log("Confidence:", confidence);

}
