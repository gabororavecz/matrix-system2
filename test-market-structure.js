const {
    getMarketData
} = require("./services/marketService");

const {
    analyzeMarketStructure
} = require("./services/marketStructureService");


// =====================================================
// TEST MARKETS
// =====================================================

const markets = [

    "SPX500",
    "BTCUSD",
    "XAUUSD",
    "USOIL"

];


// =====================================================
// RUN TEST
// =====================================================

async function run() {

    for (const asset of markets) {

        console.log("\n==============================");
        console.log(`Testing: ${asset}`);
        console.log("==============================");

        try {

            // ==========================================
            // GET EXISTING YAHOO MARKET DATA
            // ==========================================

            const candles =
                await getMarketData(asset);


            console.log(
                "Candles:",
                candles.length
            );


            if (!candles.length) {

                console.log(
                    "No market data - skipping"
                );

                continue;
            }


            // ==========================================
            // MARKET STRUCTURE
            // ==========================================

            const structure =
                analyzeMarketStructure(candles);


            // ==========================================
            // RESULTS
            // ==========================================

            console.log(
                "Current price:",
                structure.currentPrice
            );

            console.log(
                "Structure:",
                structure.structure
            );

            console.log(
                "Support:",
                structure.support
            );

            console.log(
                "Resistance:",
                structure.resistance
            );

            console.log(
                "Breakout:",
                structure.breakout
            );


            // ==========================================
            // SWING HIGHS
            // ==========================================

            console.log(
                "Recent swing highs:"
            );

            console.log(
                structure.swingHighs.slice(-3)
            );


            // ==========================================
            // SWING LOWS
            // ==========================================

            console.log(
                "Recent swing lows:"
            );

            console.log(
                structure.swingLows.slice(-3)
            );


        } catch (error) {

            console.error(
                "ERROR:",
                error.message
            );

        }
    }
}


run();