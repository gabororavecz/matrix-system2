const {

    getMarketData,

    getRSI,

    getTrend,

    getMACD,

    getATR,

    getAverageVolume

} = require("./services/marketService");

(async () => {

    const data = await getMarketData("SPX500");

    console.log("Candles:", data.length);

    console.log("RSI:", getRSI(data));

    console.log("Trend:", getTrend(data));

    console.log("MACD:", getMACD(data));

    console.log("ATR:", getATR(data));

    console.log("Average Volume:", getAverageVolume(data));

})();