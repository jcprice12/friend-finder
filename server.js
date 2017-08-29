// Dependencies
var express = require("express");
var body_parser = require("body-parser");
var path = require("path");

//variables
var app = express();
var PORT = 8080;

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});