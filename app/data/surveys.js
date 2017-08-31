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

var insertAnswers = function(idPeople, myObj, connection){
    var promise = new Promise(function(resolve, reject){
        connection.beginTransaction(function(errTrans){
            if(errTrans){
                reject(errTrans);
            } else {
                connection.query("SELECT idAnswers, idQuestions, answer, idAnswerSets FROM `AnswerSets` NATURAL JOIN `Answers` WHERE idPeople = ? AND idSurveys = ?", [idPeople, myObj.answerSet.idSurveys], function(errSel, selRes){
                    if(errSel){
                        connection.rollback(function(){
                            reject(errSel);
                        });
                    } else {
                        if(selRes.length > 0){
                            for(var i = 0; i < myObj.answerSet.answers.length; i++){
                                for(var j = 0; j < selRes.length; j++){
                                    if(parseInt(selRes[j].idQuestions) == myObj.answerSet.answers[i][0]){
                                        myObj.answerSet.answers[i].push(parseInt(selRes[j].idAnswers));
                                        myObj.answerSet.answers[i].push(parseInt(selRes[j].idAnswerSets));
                                        break;
                                    }
                                }
                            }
                            var mySql = "INSERT INTO `Answers` (idQuestions, answer, idAnswers, idAnswerSets) VALUES ? ON DUPLICATE KEY UPDATE answer = VALUES(answer)";
                            connection.query(mySql, [myObj.answerSet.answers], function(errUpdate, updateRes){
                                if(errUpdate){
                                    connection.rollback(function(){
                                        reject(errUpdate);
                                    });
                                } else {
                                    connection.commit(function(commitErr){
                                        if(commitErr){
                                            connection.rollback(function(){
                                                reject(commitErr);
                                            });
                                        } else {
                                            resolve(updateRes);
                                        }
                                    })
                                }
                            });
                        } else {
                            var mahAnswerSet = {
                                "idPeople" : idPeople,
                                "idSurveys" : myObj.answerSet.idSurveys,
                            };
                            connection.query("INSERT INTO `AnswerSets` SET ?", mahAnswerSet, function(errInsertAnswSet, insertAnswSetRes){
                                if(errInsertAnswSet){
                                    connection.rollback(function(){
                                        reject(errInsertAnswSet);
                                    });
                                } else {
                                    connection.query("SELECT idAnswerSets FROM `AnswerSets` WHERE idPeople = ? AND idSurveys = ?", [mahAnswerSet["idPeople"], mahAnswerSet["idSurveys"]], function(errSelAnswSet, selAnswSetRes){
                                        if(errSelAnswSet){
                                            connection.rollback(function(){
                                                reject(errSelAnswSet);
                                            });
                                        } else {
                                            for(var i = 0; i < myObj.answerSet.answers.length; i++){
                                                myObj.answerSet.answers[i].push(parseInt(selAnswSetRes[0].idAnswerSets));
                                            }
                                            connection.query("INSERT INTO `Answers` (idQuestions, answer, idAnswerSets) VALUES ?", [myObj.answerSet.answers], function(errInsertAnsw, insertAnswRes){
                                                if(errInsertAnsw){
                                                    connection.rollback(function(){
                                                        reject(errInsertAnsw);
                                                    });
                                                } else {
                                                    connection.commit(function(commitErr){
                                                        if(commitErr){
                                                            connection.rollback(function(){
                                                                reject(commitErr);
                                                            })
                                                        } else {
                                                            resolve(insertAnswRes);//TODO
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    });
    return promise;
}

exports.insertAnswers = insertAnswers;
exports.getSurvey = getSurvey;
exports.getSurveys = getSurveys;