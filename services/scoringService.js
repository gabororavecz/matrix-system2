function calculateIndicatorScore({
    rsi,
    trend,
    macd,
    atr,
    volume
}) {
    let score = 0;

    // =========================
    // RSI (0–20)
    // =========================
    if (rsi !== null && rsi !== undefined) {

        if (rsi > 70 || rsi < 30) {
            score += 20; // strong edge
        } else if (rsi > 55 || rsi < 45) {
            score += 12; // moderate
        } else {
            score += 5;  // weak
        }

    } else {
        score -= 10; // missing data penalty
    }

    // =========================
    // TREND (0–20)
    // =========================
    if (trend === "BULLISH") score += 20;
    else if (trend === "BEARISH") score += 20;
    else score += 5;

    // =========================
    // MACD (0–20)
    // =========================
    if (macd) {
        if (macd.MACD > macd.signal) {
            score += 20;
        } else {
            score += 10;
        }
    } else {
        score += 5;
    }

    // =========================
    // ATR (0–20)
    // =========================
    if (atr) {
        // high volatility = more opportunity
        score += 20;
    } else {
        score += 5;
    }

    // =========================
    // VOLUME (0–20)
    // =========================
    if (volume) {
        score += 20;
    } else {
        score += 5;
    }

    return score;
}


// =====================================================
// FINAL SCORING FUNCTION (THIS IS WHAT YOU WILL USE)
// =====================================================

function calculateConfidence({
    sentiment,
    impact,
    rsi,
    trend,
    macd,
    atr,
    volume,
    sourceWeight = 1,
    freshnessWeight = 1
}) {

    // Step 1: base sentiment score
    let score = 0;

    if (sentiment.includes("STRONG_BULLISH")) score += 40;
    else if (sentiment.includes("BULLISH")) score += 25;
    else if (sentiment.includes("STRONG_BEARISH")) score += 40;
    else if (sentiment.includes("BEARISH")) score += 25;

    // Step 2: impact weighting
    if (impact === "HIGH") score += 15;
    else score += 8;

    // Step 3: technical indicators
    const indicatorScore = calculateIndicatorScore({
        rsi,
        trend,
        macd,
        atr,
        volume
    });

    score += indicatorScore;

    // Step 4: external weights
    score *= sourceWeight;
    score *= freshnessWeight;

    // Step 5: cap
    return Math.min(Math.round(score), 95);
}

module.exports = {
    calculateConfidence
};