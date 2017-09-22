// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");

//variables
var app = express();
var PORT = process.env.PORT || 8080;
var DB_HOST = process.env.DB_HOST || "localhost";
var DB_NAME = process.env.DB_NAME || "friends_finder_db";
var DB_USER = process.env.MYSQL_USER || "root";
var DB_PASSWORD = process.env.MYSQL_PASSWORD || "root";
//using a pool so that jaws db doesn't close the db connection
var pool = mysql.createPool({
    connectionLimit : 10,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

var getPool = function(){
    return pool;
}

app.use(express.static(path.join(__dirname, 'app', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//start app and listen on defined port
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

require('./app/routing/apiRoutes.js')(app);
require('./app/routing/htmlRoutes.js')(app);

exports.getPool = getPool;
