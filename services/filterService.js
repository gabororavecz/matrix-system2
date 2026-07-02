function filterTrades(trades) {

    return trades.filter(t => {

        // remove dead signals
        if (!t.action || t.action === "NONE") return false;

        // remove low confidence noise
        if (t.confidence < 60) return false;

        // remove blocked / no edge trades
        if (
            t.finalTrade.includes("BLOCKED") ||
            t.finalTrade.includes("NO EDGE")
        ) return false;

        return true;
    });
}

module.exports = {
    filterTrades
};