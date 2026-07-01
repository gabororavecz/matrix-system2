const {
    fetchDaily,
    getRSI,
    getTrend,
    getMACD,
    getATR,
    getAverageVolume
} = require("./services/marketService");

const { RSI, SMA, MACD, ATR } = require("technicalindicators");

(async () => {

    const data = await fetchDaily("AAPL");

    console.log("Candles:", data.length);

    console.log("RSI:", getRSI(data, RSI));
    console.log("Trend:", getTrend(data, SMA));
    console.log("MACD:", getMACD(data, MACD));
    console.log("ATR:", getATR(data, ATR));
    console.log("Volume:", getAverageVolume(data));

})();