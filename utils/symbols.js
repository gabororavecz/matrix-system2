const symbols = {
    // Indices
    SPX500: "SPY",
    NASDAQ: "QQQ",
    DOW: "DIA",

    // Crypto
    BTCUSD: "BTC-USD",
    ETHUSD: "ETH-USD",

    // Forex
    GBPUSD: "GBPUSD=X",
    EURUSD: "EURUSD=X",
    EURGBP: "EURGBP=X",
    GBPJPY: "GBPJPY=X",
    GBPHUF: "GBPHUF=X",
    USDJPY: "JPY=X",
    USDCHF: "CHF=X",
    AUDUSD: "AUDUSD=X",
    USDCAD: "CAD=X",
    NZDUSD: "NZDUSD=X",

    // Commodities
    OIL: "CL=F",
    USOIL: "CL=F",
    GOLD: "GC=F",
    XAUUSD: "GC=F"
};

function getSymbol(asset) {
    return symbols[asset] || null;
}

module.exports = {
    getSymbol
};