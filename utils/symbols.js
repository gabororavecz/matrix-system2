const symbols = {
    SPX500: "SPY",
    USOIL: "USO",
    XAUUSD: "GLD",
    BTCUSD: "BTC-USD",
    ETHUSD: "ETH-USD",
    NASDAQ: "QQQ",
    DOW: "DIA"
};

function getSymbol(asset) {
    return symbols[asset] || null;
}

module.exports = {
    getSymbol
};