const { fetchDaily } = require("./marketService");

async function getFuturePrice(symbol) {
    const data = await fetchDaily(symbol);

    // Need enough history
    if (!data || data.length < 6) {
        return null;
    }

    // Simulate:
    // current = 5 days ago
    // future = latest close
    const current = data[data.length - 6].close;
    const future = data[data.length - 1].close;

    return {
        current,
        future
    };
}

function evaluateTrade(action, entry, exit) {
    if (action === "BUY") {
        return exit > entry ? "WIN" : "LOSS";
    }

    if (action === "SELL") {
        return exit < entry ? "WIN" : "LOSS";
    }

    return "UNKNOWN";
}

module.exports = {
    getFuturePrice,
    evaluateTrade
};