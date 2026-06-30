const db = require("./database/sqlite");

console.log("Database connected!");

const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all();

console.log(tables);