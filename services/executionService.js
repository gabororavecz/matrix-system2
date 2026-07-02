function shouldExecute(consensus) {

    if (!consensus) return false;

    const strength = consensus.consensusStrength;
    const confidence = consensus.avgConfidence;

    // minimum thresholds
    if (strength < 65) return false;
    if (confidence < 70) return false;

    // avoid low conviction markets
    if (consensus.BUY === consensus.SELL) return false;

    return true;
}

function executionDecision(consensus) {

    if (!shouldExecute(consensus)) {
        return {
            action: "NO TRADE",
            reason: "Weak consensus or low confidence"
        };
    }

    return {
        action: consensus.direction,
        strength: consensus.consensusStrength,
        confidence: consensus.avgConfidence
    };
}

module.exports = {
    shouldExecute,
    executionDecision
};