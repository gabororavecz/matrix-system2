// =====================================================
// MARKET STRUCTURE SERVICE
// =====================================================

// -----------------------------------------------------
// Find swing highs and swing lows
// -----------------------------------------------------

function findSwingPoints(candles, lookback = 3) {

    const swingHighs = [];
    const swingLows = [];

    for (
        let i = lookback;
        i < candles.length - lookback;
        i++
    ) {

        const current = candles[i];

        let isSwingHigh = true;
        let isSwingLow = true;

        // ---------------------------------------------
        // Check candles around current candle
        // ---------------------------------------------

        for (
            let j = 1;
            j <= lookback;
            j++
        ) {

            // Swing high
            if (
                candles[i - j].high >= current.high ||
                candles[i + j].high >= current.high
            ) {
                isSwingHigh = false;
            }

            // Swing low
            if (
                candles[i - j].low <= current.low ||
                candles[i + j].low <= current.low
            ) {
                isSwingLow = false;
            }
        }

        if (isSwingHigh) {

            swingHighs.push({
                index: i,
                price: current.high,
                date: current.date
            });

        }

        if (isSwingLow) {

            swingLows.push({
                index: i,
                price: current.low,
                date: current.date
            });

        }
    }

    return {
        swingHighs,
        swingLows
    };
}


// -----------------------------------------------------
// Determine market structure
// -----------------------------------------------------

function determineStructure(
    swingHighs,
    swingLows
) {

    if (
        swingHighs.length < 2 ||
        swingLows.length < 2
    ) {
        return "UNKNOWN";
    }

    const previousHigh =
        swingHighs[swingHighs.length - 2];

    const latestHigh =
        swingHighs[swingHighs.length - 1];

    const previousLow =
        swingLows[swingLows.length - 2];

    const latestLow =
        swingLows[swingLows.length - 1];


    // Higher High + Higher Low
    if (
        latestHigh.price > previousHigh.price &&
        latestLow.price > previousLow.price
    ) {
        return "BULLISH";
    }


    // Lower High + Lower Low
    if (
        latestHigh.price < previousHigh.price &&
        latestLow.price < previousLow.price
    ) {
        return "BEARISH";
    }


    return "RANGE";
}


// -----------------------------------------------------
// Find nearest support
// -----------------------------------------------------

function findSupport(
    currentPrice,
    swingLows
) {

    const supports =
        swingLows
            .filter(
                swing =>
                    swing.price < currentPrice
            )
            .sort(
                (a, b) =>
                    b.price - a.price
            );

    return supports.length
        ? supports[0]
        : null;
}


// -----------------------------------------------------
// Find nearest resistance
// -----------------------------------------------------

function findResistance(
    currentPrice,
    swingHighs
) {

    const resistances =
        swingHighs
            .filter(
                swing =>
                    swing.price > currentPrice
            )
            .sort(
                (a, b) =>
                    a.price - b.price
            );

    return resistances.length
        ? resistances[0]
        : null;
}


// -----------------------------------------------------
// Detect breakout / breakdown
// -----------------------------------------------------

function detectBreakout(
    candles,
    support,
    resistance
) {

    if (!candles.length) {
        return "NONE";
    }

    const latest =
        candles[candles.length - 1];

    const previous =
        candles[candles.length - 2];


    // ---------------------------------------------
    // Breakout above resistance
    // ---------------------------------------------

    if (
        resistance &&
        previous.close <= resistance.price &&
        latest.close > resistance.price
    ) {
        return "BREAKOUT";
    }


    // ---------------------------------------------
    // Breakdown below support
    // ---------------------------------------------

    if (
        support &&
        previous.close >= support.price &&
        latest.close < support.price
    ) {
        return "BREAKDOWN";
    }


    return "NONE";
}


// -----------------------------------------------------
// Main market structure analysis
// -----------------------------------------------------

function analyzeMarketStructure(candles) {

    if (!candles || candles.length < 20) {

        return {
            currentPrice: null,
            structure: "UNKNOWN",
            swingHighs: [],
            swingLows: [],
            support: null,
            resistance: null,
            breakout: "NONE"
        };

    }


    const currentPrice =
        candles[candles.length - 1].close;


    // ---------------------------------------------
    // Swing points
    // ---------------------------------------------

    const {
        swingHighs,
        swingLows
    } = findSwingPoints(candles);


    // ---------------------------------------------
    // Structure
    // ---------------------------------------------

    const structure =
        determineStructure(
            swingHighs,
            swingLows
        );


    // ---------------------------------------------
    // Support / resistance
    // ---------------------------------------------

    const support =
        findSupport(
            currentPrice,
            swingLows
        );

    const resistance =
        findResistance(
            currentPrice,
            swingHighs
        );


    // ---------------------------------------------
    // Breakout / breakdown
    // ---------------------------------------------

    const breakout =
        detectBreakout(
            candles,
            support,
            resistance
        );


    return {

        currentPrice,

        structure,

        swingHighs,

        swingLows,

        support,

        resistance,

        breakout

    };
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    findSwingPoints,
    determineStructure,
    findSupport,
    findResistance,
    detectBreakout,
    analyzeMarketStructure
};