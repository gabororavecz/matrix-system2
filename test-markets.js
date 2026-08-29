const {
    getMarketData,
    getRSI,
    getTrend,
    getMACD,
    getATR,
    getAverageVolume
} = require("./services/marketService");

const assets = [
    "SPX500",
    "BTCUSD",
    "GBPUSD",
    "EURUSD",
    "EURGBP",
    "GBPJPY",
    "GBPHUF",
    "USOIL",
    "XAUUSD"
];

async function testMarkets() {

    for (const asset of assets) {

        console.log("\n==============================");
        console.log("Testing:", asset);
        console.log("==============================");

        try {

            const data = await getMarketData(asset);

            console.log("Candles:", data.length);

            if (!data.length) {
                console.log("❌ No market data");
                continue;
            }

            const rsi = getRSI(data);
            const trend = getTrend(data);
            const macd = getMACD(data);
            const atr = getATR(data);
            const volume = getAverageVolume(data);

            console.log("RSI:", rsi);
            console.log("Trend:", trend);
            console.log("MACD:", macd);
            console.log("ATR:", atr);
            console.log("Average Volume:", volume);

        } catch (error) {

            console.log("❌ ERROR:", error.message);

        }
    }
}

testMarkets();