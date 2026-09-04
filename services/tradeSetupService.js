// =====================================================
// TRADE SETUP SERVICE
// =====================================================

function buildTradeSetup({
    asset,
    action,
    currentPrice,
    support,
    resistance,
    atr,
    structure
}) {

    if (!currentPrice || !atr) {
        return null;
    }

    const supportPrice =
        support?.price ?? null;

    const resistancePrice =
        resistance?.price ?? null;


    // =================================================
    // BUY SETUP
    // =================================================

    if (action === "BUY") {

        let entry;
        let stopLoss;
        let takeProfit1;
        let takeProfit2;


        // ---------------------------------------------
        // RANGE
        // ---------------------------------------------

        if (structure === "RANGE") {

            // Buy near support
            entry =
                supportPrice
                    ? supportPrice + atr * 0.10
                    : currentPrice;

            stopLoss =
                supportPrice
                    ? supportPrice - atr * 0.50
                    : currentPrice - atr;

            takeProfit1 =
                resistancePrice
                    ? resistancePrice - atr * 0.20
                    : entry + atr * 1.5;

            takeProfit2 =
                resistancePrice
                    ? resistancePrice
                    : entry + atr * 2.5;
        }


        // ---------------------------------------------
        // BULLISH
        // ---------------------------------------------

        else if (structure === "BULLISH") {

            entry = currentPrice;

            stopLoss =
                supportPrice
                    ? supportPrice - atr * 0.30
                    : currentPrice - atr;

            takeProfit1 =
                currentPrice + atr * 1.5;

            takeProfit2 =
                currentPrice + atr * 3;
        }


        // ---------------------------------------------
        // DEFAULT
        // ---------------------------------------------

        else {

            entry = currentPrice;

            stopLoss =
                currentPrice - atr;

            takeProfit1 =
                currentPrice + atr * 1.5;

            takeProfit2 =
                currentPrice + atr * 2.5;
        }


        return calculateTradeMetrics({
            asset,
            action,
            entry,
            stopLoss,
            takeProfit1,
            takeProfit2,
            structure
        });
    }


    // =================================================
    // SELL SETUP
    // =================================================

    if (action === "SELL") {

        let entry;
        let stopLoss;
        let takeProfit1;
        let takeProfit2;


        // ---------------------------------------------
        // RANGE
        // ---------------------------------------------

        if (structure === "RANGE") {

            // Sell near resistance
            entry =
                resistancePrice
                    ? resistancePrice - atr * 0.10
                    : currentPrice;

            stopLoss =
                resistancePrice
                    ? resistancePrice + atr * 0.50
                    : currentPrice + atr;

            takeProfit1 =
                supportPrice
                    ? supportPrice + atr * 0.20
                    : entry - atr * 1.5;

            takeProfit2 =
                supportPrice
                    ? supportPrice
                    : entry - atr * 2.5;
        }


        // ---------------------------------------------
        // BEARISH
        // ---------------------------------------------

        else if (structure === "BEARISH") {

            entry = currentPrice;

            stopLoss =
                resistancePrice
                    ? resistancePrice + atr * 0.30
                    : currentPrice + atr;

            takeProfit1 =
                currentPrice - atr * 1.5;

            takeProfit2 =
                currentPrice - atr * 3;
        }


        // ---------------------------------------------
        // DEFAULT
        // ---------------------------------------------

        else {

            entry = currentPrice;

            stopLoss =
                currentPrice + atr;

            takeProfit1 =
                currentPrice - atr * 1.5;

            takeProfit2 =
                currentPrice - atr * 2.5;
        }


        return calculateTradeMetrics({
            asset,
            action,
            entry,
            stopLoss,
            takeProfit1,
            takeProfit2,
            structure
        });
    }


    return null;
}


// =====================================================
// CALCULATE RISK / REWARD
// =====================================================

function calculateTradeMetrics({
    asset,
    action,
    entry,
    stopLoss,
    takeProfit1,
    takeProfit2,
    structure
}) {

    const risk =
        Math.abs(entry - stopLoss);

    const reward1 =
        Math.abs(takeProfit1 - entry);

    const reward2 =
        Math.abs(takeProfit2 - entry);


    const rr1 =
        risk > 0
            ? reward1 / risk
            : 0;

    const rr2 =
        risk > 0
            ? reward2 / risk
            : 0;


    return {

        asset,

        action,

        structure,

        entry:
            round(entry),

        stopLoss:
            round(stopLoss),

        takeProfit1:
            round(takeProfit1),

        takeProfit2:
            round(takeProfit2),

        risk:
            round(risk),

        reward1:
            round(reward1),

        reward2:
            round(reward2),

        riskReward1:
            round(rr1),

        riskReward2:
            round(rr2),

        valid:
            rr1 >= 1.5
    };
}


// =====================================================
// ROUND
// =====================================================

function round(value) {

    return Number(
        Number(value).toFixed(2)
    );
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    buildTradeSetup

};