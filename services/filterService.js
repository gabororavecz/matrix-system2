function filterTrades(trades) {

    return trades.filter(t => {

        if (!t.action || t.action === "NONE") {
            console.log("Rejected:", t.asset, "No action");
            return false;
        }

        if (t.confidence < 60) {
            console.log("Rejected:", t.asset, "Low confidence:", t.confidence);
            return false;
        }

        if (
            t.finalTrade.includes("BLOCKED") ||
            t.finalTrade.includes("NO EDGE")
        ) {
            console.log("Rejected:", t.asset, t.finalTrade);
            return false;
        }

        console.log("Accepted:", t.asset, t.confidence);

        return true;
    });

}

module.exports = { filterTrades };