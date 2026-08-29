function calculateIndicatorScore({
    action,
    rsi,
    trend,
    macd,
    atr,
    volume
}) {

    let score = 0;

    // =========================
    // RSI
    // =========================

    if (rsi !== null && rsi !== undefined) {

        if (action === "BUY") {

            if (rsi >= 50 && rsi <= 65) {
                score += 20;
            } else if (rsi > 65 && rsi <= 70) {
                score += 12;
            } else if (rsi > 70) {
                score -= 10;
            } else if (rsi >= 40) {
                score += 8;
            } else {
                score -= 5;
            }

        }

        if (action === "SELL") {

            if (rsi <= 50 && rsi >= 35) {
                score += 20;
            } else if (rsi < 35) {
                score -= 10;
            } else if (rsi <= 60) {
                score += 8;
            } else {
                score -= 5;
            }
        }
    }


    // =========================
    // TREND
    // =========================

    if (action === "BUY") {

        if (trend === "BULLISH") {
            score += 25;
        } else if (trend === "BEARISH") {
            score -= 20;
        }

    }

    if (action === "SELL") {

        if (trend === "BEARISH") {
            score += 25;
        } else if (trend === "BULLISH") {
            score -= 20;
        }
    }


    // =========================
    // MACD
    // =========================

    if (macd) {

        const bullish = macd.MACD > macd.signal;
        const bearish = macd.MACD < macd.signal;

        if (action === "BUY") {

            if (bullish) {
                score += 20;
            } else if (bearish) {
                score -= 15;
            }

        }

        if (action === "SELL") {

            if (bearish) {
                score += 20;
            } else if (bullish) {
                score -= 15;
            }
        }
    }


    // =========================
    // ATR
    // =========================

    if (atr !== null && atr !== undefined && atr > 0) {
        score += 10;
    }


    // =========================
    // VOLUME
    // =========================

    if (volume && volume > 0) {
        score += 10;
    }

    // Forex often has no Yahoo volume.
    // No penalty when volume = 0.


    return score;
}


// =====================================================
// FINAL CONFIDENCE
// =====================================================

function calculateConfidence({
    action,
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

    let score = 50;


   // =========================
    // NEWS SENTIMENT
    // =========================

    if (sentiment === "STRONG_BULLISH") {
        score += action === "BUY" ? 20 : -20;
    }

    else if (sentiment === "BULLISH") {
        score += action === "BUY" ? 12 : -12;
    }

    else if (sentiment === "STRONG_BEARISH") {
        score += action === "SELL" ? 20 : -20;
    }

    else if (sentiment === "BEARISH") {
        score += action === "SELL" ? 12 : -12;
    }


    // =========================
    // IMPACT
    // =========================

    if (impact === "HIGH") {
        score += 5;
    }


    // =========================
    // TECHNICAL CONFLUENCE
    // =========================

    const indicatorScore = calculateIndicatorScore({
        action,
        rsi,
        trend,
        macd,
        atr,
        volume
    });

    score += indicatorScore;


    // =========================
    // SOURCE / FRESHNESS
    // =========================

    score *= sourceWeight;
    score *= freshnessWeight;


    // =========================
    // LIMIT
    // =========================

    return Math.max(
        0,
        Math.min(Math.round(score), 95)
    );
}

module.exports = {
    calculateConfidence
};