const axios = require("axios");

require("dotenv").config();

function deduplicateArticles(articles) {

    const seen = new Set();

    return articles.filter(article => {

        const key = (
            (article.title || "") +
            (article.description || "")
        )
            .toLowerCase()
            .replace(/[^\w]/g, "");

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;

    });

}

function getSourceWeight(source) {

    if (!source) return 1;

    source = source.toLowerCase();

    if (source.includes("reuters")) return 1.30;

    if (source.includes("bloomberg")) return 1.30;

    if (source.includes("financial times")) return 1.25;

    if (source.includes("wall street journal")) return 1.25;

    if (source.includes("cnbc")) return 1.20;

    if (source.includes("marketwatch")) return 1.15;

    if (source.includes("investing")) return 1.10;

    return 1;

}

function getFreshnessWeight(date) {

    if (!date) return 1;

    const published = new Date(date);

    const ageHours =
        (Date.now() - published.getTime()) / 3600000;

    if (ageHours <= 2) return 1.20;

    if (ageHours <= 6) return 1.10;

    if (ageHours <= 24) return 1.05;

    return 1;

}

async function fetchNews() {

    const response = await axios.get(

        `https://newsapi.org/v2/everything?q=forex OR stocks&pageSize=100&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`

    );

    return deduplicateArticles(response.data.articles);

}

module.exports = {

    fetchNews,

    getSourceWeight,

    getFreshnessWeight

};