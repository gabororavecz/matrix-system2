const {

    analyzeSentiment,

    detectAssets,

    detectImpact,

    mapToTrade

} = require("./services/sentimentService");

const text =
"Gold prices surge after inflation fears increase.";

const sentiment = analyzeSentiment(text);

const assets = detectAssets(text);

const impact = detectImpact(text);

console.log("Sentiment:", sentiment);

console.log("Assets:", assets);

console.log("Impact:", impact);

console.log(

    mapToTrade(

        assets[0],

        sentiment

    )

);