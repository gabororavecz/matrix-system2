const yahoo = require("yahoo-finance2").default;
const { getSymbol } = require("../utils/symbols");

async function getFuturePrice(asset, daysAhead = 1) {

    const symbol = getSymbol(asset);

    if (!symbol) return null;

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 10);

    const data = await yahoo.historical(symbol, {
        period1: start,
        period2: end,
        interval: "1d"
    });

    if (!data || data.length < 2) return null;

    return {
        current: data[data.length - 2].close,
        future: data[data.length - 1].close
    };
}

function evaluateTrade(direction, entry, exit) {

    const move = ((exit - entry) / entry) * 100;

    if (direction === "BUY") {
        return move > 0 ? "WIN" : "LOSS";
    }

    if (direction === "SELL") {
        return move < 0 ? "WIN" : "LOSS";
    }

    return "UNKNOWN";
}

module.exports = {
    getFuturePrice,
    evaluateTrade
};