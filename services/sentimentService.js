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
    // GBP/USD
if (
    text.includes("gbp/usd") ||
    text.includes("gbpusd") ||
    text.includes("pound") ||
    text.includes("sterling")
) {
    assets.push("GBPUSD");
}

// EUR/GBP
if (
    text.includes("eur/gbp") ||
    text.includes("eurgbp")
) {
    assets.push("EURGBP");
}

// EUR/USD
if (
    text.includes("eur/usd") ||
    text.includes("eurusd") ||
    text.includes("euro")
) {
    assets.push("EURUSD");
}

// GBP/JPY
if (
    text.includes("gbp/jpy") ||
    text.includes("gbpjpy")
) {
    assets.push("GBPJPY");
}

// GBP/HUF
if (
    text.includes("gbp/huf") ||
    text.includes("gbphuf")
) {
    assets.push("GBPHUF");
}
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
    if (asset === "GBPUSD") {

    if (sentiment.includes("BEARISH"))
        return "SELL GBPUSD";

    if (sentiment.includes("BULLISH"))
        return "BUY GBPUSD";
}

if (asset === "EURGBP") {

    if (sentiment.includes("BEARISH"))
        return "SELL EURGBP";

    if (sentiment.includes("BULLISH"))
        return "BUY EURGBP";
}

if (asset === "EURUSD") {

    if (sentiment.includes("BEARISH"))
        return "SELL EURUSD";

    if (sentiment.includes("BULLISH"))
        return "BUY EURUSD";
}

if (asset === "GBPJPY") {

    if (sentiment.includes("BEARISH"))
        return "SELL GBPJPY";

    if (sentiment.includes("BULLISH"))
        return "BUY GBPJPY";
}

if (asset === "GBPHUF") {

    if (sentiment.includes("BEARISH"))
        return "SELL GBPHUF";

    if (sentiment.includes("BULLISH"))
        return "BUY GBPHUF";
}

    return "NO TRADE";
}

module.exports = {

    analyzeSentiment,

    detectAssets,

    detectImpact,

    mapToTrade

};