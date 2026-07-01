const axios = require("axios");

const API_KEY = process.env.ALPHA_VANTAGE_KEY;

// simple cache to avoid rate limits
const cache = {};
const CACHE_TIME = 60 * 1000;

async function fetchDaily(symbol) {
    const now = Date.now();

    if (cache[symbol] && now - cache[symbol].time < CACHE_TIME) {
        return cache[symbol].data;
    }

    const url =
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;

    const res = await axios.get(url);

    const series = res.data["Time Series (Daily)"];

    if (!series) return [];

    const data = Object.entries(series)
        .map(([date, value]) => ({
            date,
            close: parseFloat(value["4. close"]),
            high: parseFloat(value["2. high"]),
            low: parseFloat(value["3. low"]),
            volume: parseFloat(value["6. volume"])
        }))
        .reverse(); // oldest → newest

    cache[symbol] = {
        time: now,
        data
    };

    return data;
}

// ---------------- INDICATORS ----------------

function getCloses(data) {
    return data.map(x => x.close);
}

function getHighs(data) {
    return data.map(x => x.high);
}

function getLows(data) {
    return data.map(x => x.low);
}

function getVolumes(data) {
    return data.map(x => x.volume);
}

// RSI
function getRSI(data, RSI) {
    const closes = getCloses(data);

    const rsi = RSI.calculate({
        values: closes,
        period: 14
    });

    return rsi.at(-1) || null;
}

// SMA trend
function getTrend(data, SMA) {
    const closes = getCloses(data);

    const sma50 = SMA.calculate({ values: closes, period: 50 });
    const sma200 = SMA.calculate({ values: closes, period: 200 });

    const last50 = sma50.at(-1);
    const last200 = sma200.at(-1);

    if (!last50 || !last200) return "UNKNOWN";

    if (last50 > last200) return "BULLISH";
    if (last50 < last200) return "BEARISH";
    return "SIDEWAYS";
}

// MACD
function getMACD(data, MACD) {
    const closes = getCloses(data);

    const macd = MACD.calculate({
        values: closes,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9
    });

    return macd.at(-1) || null;
}

// ATR
function getATR(data, ATR) {
    const highs = getHighs(data);
    const lows = getLows(data);
    const closes = getCloses(data);

    const atr = ATR.calculate({
        high: highs,
        low: lows,
        close: closes,
        period: 14
    });

    return atr.at(-1) || null;
}

// Volume
function getAverageVolume(data) {
    const volumes = getVolumes(data);

    const last20 = volumes.slice(-20);
    if (!last20.length) return 0;

    return last20.reduce((a, b) => a + b, 0) / last20.length;
}

module.exports = {
    fetchDaily,
    getRSI,
    getTrend,
    getMACD,
    getATR,
    getAverageVolume
};