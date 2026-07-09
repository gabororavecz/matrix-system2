require("dotenv").config();

const express = require("express");

const newsRoute = require("./routes/news");
const evaluateRoute = require("./routes/evaluate");

const app = express();

app.use("/evaluate", evaluateRoute);

app.use(express.json());

app.use("/news", newsRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Matrix System running on port ${PORT}`);
});