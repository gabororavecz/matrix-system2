const {

    fetchNews

} = require("./services/newsService");

(async () => {

    const articles = await fetchNews();

    console.log("Articles:", articles.length);

    console.log();

    console.log(articles[0]);

})();