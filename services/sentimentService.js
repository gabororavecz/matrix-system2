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

    // =========================
    // INDICES
    // =========================

    if (
        text.includes("s&p") ||
        text.includes("s&p 500") ||
        text.includes("sp500") ||
        text.includes("nasdaq") ||
        text.includes("dow") ||
        text.includes("stocks") ||
        text.includes("equities")
    ) {
        assets.push("SPX500");
    }

    // =========================
    // OIL
    // =========================

    if (
        text.includes("oil") ||
        text.includes("crude") ||
        text.includes("wti") ||
        text.includes("brent") ||
        text.includes("energy")
    ) {
        assets.push("USOIL");
    }

    // =========================
    // GOLD
    // =========================

    if (
        text.includes("gold") ||
        text.includes("bullion") ||
        text.includes("xau")
    ) {
        assets.push("XAUUSD");
    }

    // =========================
    // BITCOIN
    // =========================

    if (
        text.includes("bitcoin") ||
        text.includes("btc") ||
        text.includes("crypto")
    ) {
        assets.push("BTCUSD");
    }

    // =========================
    // GBP / USD
    // =========================

    if (
        text.includes("gbp/usd") ||
        text.includes("gbpusd") ||
        text.includes("pound against dollar") ||
        text.includes("pound versus dollar") ||
        text.includes("sterling against dollar")
    ) {
        assets.push("GBPUSD");
    }

    // =========================
    // EUR / USD
    // =========================

    if (
        text.includes("eur/usd") ||
        text.includes("eurusd") ||
        text.includes("euro against dollar") ||
        text.includes("euro versus dollar")
    ) {
        assets.push("EURUSD");
    }

    // =========================
    // EUR / GBP
    // =========================

    if (
        text.includes("eur/gbp") ||
        text.includes("eurgbp") ||
        text.includes("euro against pound") ||
        text.includes("euro versus pound")
    ) {
        assets.push("EURGBP");
    }

    // =========================
    // GBP / JPY
    // =========================

    if (
        text.includes("gbp/jpy") ||
        text.includes("gbpjpy") ||
        text.includes("pound against yen") ||
        text.includes("pound versus yen")
    ) {
        assets.push("GBPJPY");
    }

    // =========================
    // GBP / HUF
    // =========================

    if (
        text.includes("gbp/huf") ||
        text.includes("gbphuf") ||
        text.includes("pound against forint") ||
        text.includes("sterling against forint")
    ) {
        assets.push("GBPHUF");
    }

    // =========================
    // OTHER FOREX
    // =========================

    if (
        text.includes("usd/jpy") ||
        text.includes("usdjpy") ||
        text.includes("dollar against yen")
    ) {
        assets.push("USDJPY");
    }

    if (
        text.includes("usd/chf") ||
        text.includes("usdchf") ||
        text.includes("dollar against franc")
    ) {
        assets.push("USDCHF");
    }

    if (
        text.includes("aud/usd") ||
        text.includes("audusd") ||
        text.includes("australian dollar against dollar")
    ) {
        assets.push("AUDUSD");
    }

    if (
        text.includes("usd/cad") ||
        text.includes("usdcad") ||
        text.includes("dollar against canadian dollar")
    ) {
        assets.push("USDCAD");
    }

    if (
        text.includes("nzd/usd") ||
        text.includes("nzdusd") ||
        text.includes("new zealand dollar against dollar")
    ) {
        assets.push("NZDUSD");
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