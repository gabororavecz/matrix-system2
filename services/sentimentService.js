function analyzeSentiment(text) {

    text = (text || "").toLowerCase();

    const strongBearish = [
        "crash",
        "collapse",
        "recession",
        "bankruptcy",
        "war",
        "default",
        "panic"
    ];

    const bearish = [
        "fall",
        "drop",
        "decline",
        "selloff",
        "fear",
        "warning",
        "inflation"
    ];

    const bullish = [
        "rise",
        "gain",
        "growth",
        "strong",
        "positive",
        "recovery",
        "beat expectations"
    ];

    const strongBullish = [
        "record high",
        "surge",
        "breakout",
        "boom",
        "all-time high"
    ];

    for (const word of strongBearish)
        if (text.includes(word))
            return "STRONG_BEARISH";

    for (const word of strongBullish)
        if (text.includes(word))
            return "STRONG_BULLISH";

    for (const word of bearish)
        if (text.includes(word))
            return "BEARISH";

    for (const word of bullish)
        if (text.includes(word))
            return "BULLISH";

    return "NEUTRAL";
}

function detectAssets(text) {

    text = (text || "").toLowerCase();

    const assets = [];

    if (
        text.includes("s&p") ||
        text.includes("nasdaq") ||
        text.includes("dow") ||
        text.includes("stocks") ||
        text.includes("equities")
    ) {
        assets.push("SPX500");
    }

    if (
        text.includes("oil") ||
        text.includes("crude") ||
        text.includes("energy")
    ) {
        assets.push("USOIL");
    }

    if (
        text.includes("gold")
    ) {
        assets.push("XAUUSD");
    }

    if (
        text.includes("bitcoin") ||
        text.includes("crypto")
    ) {
        assets.push("BTCUSD");
    }

    return [...new Set(assets)];
}

function detectImpact(text) {

    text = (text || "").toLowerCase();

    const highImpact = [

        "inflation",

        "interest rate",

        "federal reserve",

        "fed",

        "ecb",

        "bank of england",

        "war",

        "recession",

        "tariff",

        "cpi",

        "nfp"

    ];

    for (const word of highImpact)

        if (text.includes(word))

            return "HIGH";

    return "MEDIUM";
}

function mapToTrade(asset, sentiment) {

    if (asset === "SPX500") {

        if (sentiment.includes("BEARISH"))
            return "SELL SPX500";

        if (sentiment.includes("BULLISH"))
            return "BUY SPX500";
    }

    if (asset === "USOIL") {

        if (sentiment.includes("BEARISH"))
            return "SELL OIL";

        if (sentiment.includes("BULLISH"))
            return "BUY OIL";
    }

    if (asset === "XAUUSD") {

        if (sentiment.includes("BEARISH"))
            return "SELL GOLD";

        if (sentiment.includes("BULLISH"))
            return "BUY GOLD";
    }

    if (asset === "BTCUSD") {

        if (sentiment.includes("BEARISH"))
            return "SELL BTC";

        if (sentiment.includes("BULLISH"))
            return "BUY BTC";
    }

    return "NO TRADE";
}

module.exports = {

    analyzeSentiment,

    detectAssets,

    detectImpact,

    mapToTrade

};