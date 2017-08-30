var getSurvey = function(response, connection, id){
    var myObj = {};
    connection.query("SELECT * FROM `Surveys` WHERE `idSurveys` = ?", id, function(err, res){
        if(err){
            console.log(err);
            response.json(myObj);
            return;
        }
        if(res.length === 0){
            response.json(myObj);
            return;
        }  
        myObj = res[0];
        connection.query("SELECT q.idQuestions AS questionId, q.question AS question, q.minVal AS minVal, q.maxVal AS maxVal FROM `Questions` AS q NATURAL JOIN `SurveyQuestions` AS sq WHERE sq.idSurveys = ?", id, function(questErr, questRes){
            if(questErr){
                console.log(err);
                response.json(myObj);
            } else {
                if(questRes.length > 0) {
                    myObj.questions = questRes;
                }
                response.json(myObj);
            }
        });
    });
}

var getSurveys = function(httpResponse, connection){
    var myObj = [];
    connection.query("SELECT s.idSurveys AS idSurveys, s.name AS name, idQuestions, question, minVal, maxVal FROM `Surveys` AS s NATURAL JOIN `SurveyQuestions` NATURAL JOIN `Questions` ORDER BY s.idSurveys", function(err, res){
        if(err){
            console.log(err);
            httpResponse.json(myObj);
            return;
        }
        var counter = -1;
        var currentSurvey = -1;
        var tempQuestion;
        var tempObj;
        for(var i = 0; i < res.length; i++){
            if(currentSurvey !== res[i].idSurveys){
                currentSurvey = res[i].idSurveys;
                counter++;
                tempObj = {};
                tempObj.idSurveys = res[i].idSurveys;
                tempObj.name = res[i].name;
                tempObj.questions = [];
                myObj.push(tempObj);
            }
            tempQuestion = {};
            tempQuestion.idQuestions = res[i].idQuestions;
            tempQuestion.question = res[i].question;
            tempQuestion.minVal = res[i].minVal;
            tempQuestion.maxVal = res[i].maxVal;
            myObj[counter].questions.push(tempQuestion);
        }
        httpResponse.json(myObj);
    });
}

exports.getSurvey = getSurvey;
exports.getSurveys = getSurveys;