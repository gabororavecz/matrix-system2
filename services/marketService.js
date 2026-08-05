const yahooFinance = require("yahoo-finance2").default;
const { RSI, SMA, MACD, ATR } = require("technicalindicators");
const { getSymbol } = require("../utils/symbol");

const cache = {};
const CACHE_TIME = 60 * 1000;

async function getMarketData(asset) {

    const symbol = getSymbol(asset);

    if (!symbol) {
        console.log("Unknown asset:", asset);
        return [];
    }

    if (
        cache[symbol] &&
        Date.now() - cache[symbol].time < CACHE_TIME
    ) {
        return cache[symbol].data;
    }

    console.log("Fetching Yahoo data:", symbol);

    try {

        const result = await yahooFinance.historical(symbol, {
            period1: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
            interval: "1d"
        });

        if (!result || result.length === 0) {
            console.log("No Yahoo data:", symbol);
            return [];
        }

        const candles = result
            .filter(c => c.close)
            .map(c => ({
                date: c.date,
                close: c.close,
                high: c.high,
                low: c.low,
                volume: c.volume || 0
            }));

        cache[symbol] = {
            time: Date.now(),
            data: candles
        };

        console.log(symbol, "candles:", candles.length);

        return candles;

    } catch (err) {

        console.log("Yahoo error:", symbol);
        console.log(err.message);

        return [];
    }
}

function getRSI(data) {

    const values = data.map(x => x.close);

    const result = RSI.calculate({
        values,
        period: 14
    });

    return result.at(-1) ?? null;
}

function getTrend(data) {

    const values = data.map(x => x.close);

    const sma50 = SMA.calculate({
        values,
        period: 50
    });

    const sma200 = SMA.calculate({
        values,
        period: 200
    });

    const last50 = sma50.at(-1);
    const last200 = sma200.at(-1);

    if (!last50 || !last200)
        return "UNKNOWN";

    if (last50 > last200)
        return "BULLISH";

    if (last50 < last200)
        return "BEARISH";

    return "SIDEWAYS";
}

function getMACD(data) {

    const values = data.map(x => x.close);

    const result = MACD.calculate({
        values,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9
    });

    return result.at(-1) ?? null;
}

function getATR(data) {

    const result = ATR.calculate({
        high: data.map(x => x.high),
        low: data.map(x => x.low),
        close: data.map(x => x.close),
        period: 14
    });

    return result.at(-1) ?? null;
}

function getAverageVolume(data) {

    const volumes = data
        .map(x => x.volume)
        .slice(-20);

    if (!volumes.length)
        return 0;

    return volumes.reduce((a, b) => a + b, 0) / volumes.length;
}

module.exports = {
    getMarketData,
    getRSI,
    getTrend,
    getMACD,
    getATR,
    getAverageVolume
};