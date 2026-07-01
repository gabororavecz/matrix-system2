function buildConsensus(trades) {
    const grouped = {};

    for (const trade of trades) {

        const key = trade.asset;

        if (!grouped[key]) {
            grouped[key] = {
                asset: trade.asset,
                BUY: 0,
                SELL: 0,
                total: 0,
                weightedConfidence: 0,
                trades: []
            };
        }

        const direction = trade.action; // BUY or SELL

        if (direction === "BUY") grouped[key].BUY += 1;
        if (direction === "SELL") grouped[key].SELL += 1;

        grouped[key].total += 1;
        grouped[key].weightedConfidence += trade.confidence || 0;

        grouped[key].trades.push(trade);
    }

    const results = Object.values(grouped).map(group => {

        const buy = group.BUY;
        const sell = group.SELL;

        const direction =
            buy > sell ? "BUY" :
            sell > buy ? "SELL" :
            "NEUTRAL";

        const dominant = Math.max(buy, sell);
        const consensusStrength = group.total
            ? Math.round((dominant / group.total) * 100)
            : 0;

        const avgConfidence = group.total
            ? Math.round(group.weightedConfidence / group.total)
            : 0;

        return {
            asset: group.asset,
            direction,
            BUY: buy,
            SELL: sell,
            totalSignals: group.total,
            consensusStrength,
            avgConfidence,
            trades: group.trades
        };
    });

    // best consensus = strongest agreement + confidence
    const best = results
        .sort((a, b) =>
            (b.consensusStrength + b.avgConfidence) -
            (a.consensusStrength + a.avgConfidence)
        )[0];

    return {
        bestConsensus: best,
        allConsensus: results
    };
}

module.exports = {
    buildConsensus
};