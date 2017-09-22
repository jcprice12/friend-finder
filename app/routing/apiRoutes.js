var path = require("path");
var serverFile = require("./../../server.js");
var friendsFile = require("./../data/friends.js");//helper file for queries related to friends
var surveysFile = require("./../data/surveys.js");//helper file for queries related to surveys

//exporting so that app can be used from server.js
module.exports = function(app){
    //get the survey based on ID. get all surveys if no id provided
    app.get("/api/surveys/:id?", function(req, res) {
        var surveyId = req.params.id;
        var pool = serverFile.getPool();
        pool.getConnection(function(err, connection){
            if(err){
                throw err;
            } else {
                if (surveyId) {
                    surveysFile.getSurvey(res, connection, surveyId);
                } else {
                    surveysFile.getSurveys(res, connection);
                }
            }
        });
    });
    //get a friend based on id. get all friends if no id provided
    app.get("/api/friends/:id?", function(req, res){
        var personId = req.params.id;
        var pool = serverFile.getPool();
        pool.getConnection(function(err, connection){
            if(err){
                throw err;
            } else {
                if(personId) {
                    friendsFile.getFriend(res, connection, personId, {});
                } else {
                    friendsFile.getFriends(res, connection);
                }
            }
        });
    });
    //insert a person if the person exists, else update person's answer set. Find others based on answers
    app.post("/api/friends", function(req, res){
        var newAnswerSet = req.body;
        var pool = serverFile.getPool();
        pool.getConnection(function(err, connection){
            if(err){
                throw err;
            } else {
                var promise = friendsFile.insertPerson(newAnswerSet, connection);
                promise.then(function(data){
                    console.log(data);
                    var inserAnswPromise = surveysFile.insertAnswers(data[0].idPeople, newAnswerSet, connection);
                    inserAnswPromise.then(function(answData){
                        console.log(answData);
                        res.json({
                            myId : parseInt(data[0].idPeople),
                        });
                    }).catch(function(err){
                        console.log(err);
                        res.json({});
                    });
                }).catch(function(err){
                    console.log(err);
                    res.json({});
                });
            }
        });
    });
}