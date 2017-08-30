var path = require("path");
var serverFile = require("./../../server.js");
var friendsFile = require("./../data/friends.js");
var surveysFile = require("./../data/surveys.js");

module.exports = function(app){
    app.get("/api/surveys/:id?", function(req, res) {
        var surveyId = req.params.id;
        console.log(surveyId);
        if (surveyId) {
            var connection = serverFile.getConnection();
            surveysFile.getSurvey(res, connection, surveyId);
        } else {
            var connection = serverFile.getConnection();
            surveysFile.getSurveys(res, connection);
        }
    });
}