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

    app.post("/api/friends", function(req, res){
        var newAnswerSet = req.body;
        var connection = serverFile.getConnection();
        var promise = friendsFile.insertPersonAndAnswers(res, newAnswerSet, connection);
        promise.then(function(data){
            console.log(data);
            res.json(data);
        }).catch(function(err){
            console.log(err);
            res.json([]);
        });
    });
}