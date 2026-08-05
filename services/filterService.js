function filterTrades(trades) {

    return trades.filter(t => {

        console.log("Checking trade:");
        console.log(t);

        if (!t.action || t.action === "NONE") {
            console.log("Rejected: action");
            return false;
        }

        if (t.confidence < 60) {
            console.log("Rejected: confidence", t.confidence);
            return false;
        }

        if (
            t.finalTrade.includes("BLOCKED") ||
            t.finalTrade.includes("NO EDGE")
        ) {
            console.log("Rejected: blocked");
            return false;
        }

        console.log("Accepted");
        return true;
    });
}

module.exports = { filterTrades };