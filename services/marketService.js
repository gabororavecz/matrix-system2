const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const {
    RSI,
    SMA,
    MACD,
    ATR
} = require("technicalindicators");

const {
    getSymbol
} = require("../utils/symbols");


// =====================================================
// CACHE
// =====================================================

const cache = {};
const CACHE_TIME = 60 * 1000;


// =====================================================
// GET MARKET DATA
// =====================================================

async function getMarketData(asset) {

    const symbol = getSymbol(asset);

    if (!symbol) {
        console.log("Unknown asset:", asset);
        return [];
    }

    // =========================
    // CACHE
    // =========================

    if (
        cache[symbol] &&
        Date.now() - cache[symbol].time < CACHE_TIME
    ) {
        console.log("Using cached Yahoo data:", symbol);
        return cache[symbol].data;
    }

    console.log("Fetching Yahoo data:", symbol);

    try {

        const result = await yahooFinance.chart(symbol, {

            period1: new Date(
                Date.now() - 250 * 24 * 60 * 60 * 1000
            ),

            period2: new Date(),

            interval: "1d"

        });

        // yahoo-finance2 v4:
        // result.quotes contains the OHLCV candles

        if (
            !result ||
            !Array.isArray(result.quotes)
        ) {

            console.log(
                "No Yahoo quotes returned:",
                symbol
            );

            return [];
        }

        const candles = result.quotes

            .filter(c =>
                c.close !== null &&
                c.close !== undefined &&
                c.high !== null &&
                c.high !== undefined &&
                c.low !== null &&
                c.low !== undefined
            )

            .map(c => ({

                date: c.date,

                close: Number(c.close),

                high: Number(c.high),

                low: Number(c.low),

                volume: Number(c.volume || 0)

            }));


        // =========================
        // CACHE
        // =========================

        cache[symbol] = {

            time: Date.now(),

            data: candles

        };


        console.log(
            "Yahoo success:",
            symbol,
            "candles:",
            candles.length
        );


        return candles;

    } catch (err) {

        console.error(
            "Yahoo error:",
            symbol
        );

        console.error(
            err.message
        );

        return [];

    }
}


// =====================================================
// RSI
// =====================================================

function getRSI(data) {

    if (!data || data.length < 15)
        return null;

    const values = data.map(
        candle => candle.close
    );

    const result = RSI.calculate({
        values,
        period: 14
    });

    return result.at(-1) ?? null;
}


// =====================================================
// TREND
// =====================================================

function getTrend(data) {

    if (!data || data.length < 200)
        return "UNKNOWN";

    const values = data.map(
        candle => candle.close
    );

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

    if (
        last50 === undefined ||
        last200 === undefined
    ) {
        return "UNKNOWN";
    }

    if (last50 > last200)
        return "BULLISH";

    if (last50 < last200)
        return "BEARISH";

    return "SIDEWAYS";
}


// =====================================================
// MACD
// =====================================================

function getMACD(data) {

    if (!data || data.length < 35)
        return null;

    const values = data.map(
        candle => candle.close
    );

    const result = MACD.calculate({
        values,

        fastPeriod: 12,

        slowPeriod: 26,

        signalPeriod: 9,

        SimpleMAOscillator: false,

        SimpleMASignal: false
    });

    return result.at(-1) ?? null;
}


// =====================================================
// ATR
// =====================================================

function getATR(data) {

    if (!data || data.length < 15)
        return null;

    const high = data.map(
        candle => candle.high
    );

    const low = data.map(
        candle => candle.low
    );

    const close = data.map(
        candle => candle.close
    );

    const result = ATR.calculate({
        high,
        low,
        close,
        period: 14
    });

    return result.at(-1) ?? null;
}


// =====================================================
// AVERAGE VOLUME
// =====================================================

function getAverageVolume(data) {

    if (!data || !data.length)
        return 0;

    const volumes = data
        .map(candle => candle.volume)
        .slice(-20);

    if (!volumes.length)
        return 0;

    return (
        volumes.reduce(
            (total, value) => total + value,
            0
        ) / volumes.length
    );
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    getMarketData,

    getRSI,

    getTrend,

    getMACD,

    getATR,

    getAverageVolume

};