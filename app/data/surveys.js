var getSurvey = function(response, connection, id){
    var myObj = {};
    connection.query("SELECT * FROM `Surveys` WHERE `idSurveys` = ?", id, function(err, res){
        if(err){
            connection.end();
            console.log(err);
            response.json(myObj);
            return;
        }
        if(res.length === 0){
            connection.end();
            response.json(myObj);
            return;
        }  
        myObj = res[0];
        connection.query("SELECT q.idQuestions AS questionId, q.question AS question, q.minVal AS minVal, q.maxVal AS maxVal FROM `Questions` AS q NATURAL JOIN `SurveyQuestions` AS sq WHERE sq.idSurveys = ?", id, function(questErr, questRes){
            if(questErr){
                connection.end();
                console.log(err);
                response.json(myObj);
            } else {
                if(questRes.length > 0) {
                    myObj.questions = questRes;
                }
                connection.end();
                response.json(myObj);
            }
        });
    });
}

exports.getSurvey = getSurvey;