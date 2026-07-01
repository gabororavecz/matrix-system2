const symbols = {
    SPX500: "SPY",
    USOIL: "USO",
    XAUUSD: "GLD",
    NASDAQ: "QQQ",
    DOW: "DIA",
    BTCUSD: "BTC-USD",
    ETHUSD: "ETH-USD"
};

function getSymbol(asset) {
    return symbols[asset] || null;
}

module.exports = {
    getSymbol
};