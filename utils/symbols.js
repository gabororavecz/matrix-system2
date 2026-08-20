const symbols = {

    // =========================
    // FOREX
    // =========================

    GBPUSD: "GBPUSD=X",
    EURGBP: "EURGBP=X",
    EURUSD: "EURUSD=X",
    GBPJPY: "GBPJPY=X",
    GBPHUF: "GBPHUF=X",

    USDJPY: "JPY=X",
    USDCHF: "CHF=X",
    AUDUSD: "AUDUSD=X",
    USDCAD: "CAD=X",
    NZDUSD: "NZDUSD=X",

    // =========================
    // COMMODITIES
    // =========================

    XAUUSD: "GC=F",
    USOIL: "CL=F",

    // =========================
    // INDICES
    // =========================

    SPX500: "SPY",
    NASDAQ: "QQQ",
    DOW: "DIA",

    // =========================
    // CRYPTO
    // =========================

    BTCUSD: "BTC-USD",
    ETHUSD: "ETH-USD"
};

function getSymbol(asset) {
    return symbols[asset] || null;
}

module.exports = {
    getSymbol,
    symbols
};