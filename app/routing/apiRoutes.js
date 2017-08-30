var path = require("path");
var serverFile = require("./../../server.js");
var friendsFile = require("./../data/friends.js");
var surveysFile = require("./../data/surveys.js");

module.exports = function(app){
    app.get("/api/surveys/:id?", function(req, res) {
        var surveyId = req.params.id;
        var connection = serverFile.getConnection();
        if (surveyId) {
            surveysFile.getSurvey(res, connection, surveyId);
        } else {
            surveysFile.getSurveys(res, connection);
        }
    });

    app.get("/api/friends/:id?", function(req, res){
        var personId = req.params.id;
        var connection = serverFile.getConnection();
        if(personId) {
            friendsFile.getFriend(res, connection, personId, {});
        } else {
            friendsFile.getFriends(res, connection);
        }
    });
}