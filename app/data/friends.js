
var getFriend = function(httpResponse, connection, id, myPassedObj){
    myObj = myPassedObj;
    connection.query("SELECT * FROM `People` NATURAL JOIN `AnswerSets` NATURAL JOIN `Answers` WHERE idPeople = ? ORDER BY idAnswerSets, idQuestions", id, function(personErr,personRes){
        if(personErr){
            console.log(personErr);
            httpResponse.json(myObj);
        } else {
            var counter = -1;
            var currentAnswerSet = -1;
            var tempObj;
            if(personRes.length !== 0){
                myObj.idPeople = personRes[0].idPeople;
                myObj.name = personRes[0].name;
                myObj.imageUrl = personRes[0].imageUrl;
                myObj.answerSets = [];
                var tempAnswerSet;
                var tempAnswer;
                for(var i = 0; i < personRes.length; i++){
                    if(currentAnswerSet !== personRes[i].idAnswerSets){
                        currentAnswerSet = personRes[i].idAnswerSets;
                        counter++;
                        tempAnswerSet = {};
                        tempAnswerSet.idAnswerSets = personRes[i].idAnswerSets;
                        tempAnswerSet.idSurveys = personRes[i].idSurveys
                        tempAnswerSet.answers = [];
                        myObj.answerSets.push(tempAnswerSet);
                    }
                    tempAnswer = {};
                    tempAnswer.idAnswers = personRes[i].idAnswers;
                    tempAnswer.idQuestions = personRes[i].idQuestions;
                    tempAnswer.answer = personRes[i].answer;
                    myObj.answerSets[counter].answers.push(tempAnswer);
                }
            }
            httpResponse.json(myObj);
        }
    });
}

var getFriends = function(httpResponse, connection){
    myObj = [];
    connection.query("SELECT * FROM `People` NATURAL JOIN `AnswerSets` NATURAL JOIN `Answers` ORDER BY idPeople, idAnswerSets, idQuestions", function(peopleErr, peopleRes){
        if(peopleErr){
            console.log(peopleErr);
            httpResponse.json(myObj);
        } else {
            if(peopleRes.length !== 0){
                var currentPerson = -1;
                var currentPersonCounter = -1;
                var currentAnswerSetCounter = -1;
                var currentAnswerSet = -1;
                var tempPerson;
                var tempAnswerSet;
                var tempAnswer;
                for(var i = 0; i < peopleRes.length; i++){
                    if(currentPerson !== peopleRes[i].idPeople){
                        currentPerson = peopleRes[i].idPeople;
                        currentPersonCounter++;
                        currentAnswerSetCounter = -1;
                        tempPerson = {};
                        tempPerson.idPeople = currentPerson;
                        tempPerson.name = peopleRes[i].name;
                        tempPerson.imageUrl = peopleRes[i].imageUrl;
                        tempPerson.answerSets = [];
                        myObj.push(tempPerson);
                    }
                    if(currentAnswerSet !== peopleRes[i].idAnswerSets){
                        currentAnswerSet = peopleRes[i].idAnswerSets;
                        currentAnswerSetCounter++;
                        tempAnswerSet = {};
                        tempAnswerSet.idAnswerSets = peopleRes[i].idAnswerSets;
                        tempAnswerSet.idSurveys = peopleRes[i].idSurveys
                        tempAnswerSet.answers = [];
                        myObj[currentPersonCounter].answerSets.push(tempAnswerSet);
                    }
                    tempAnswer = {};
                    tempAnswer.idAnswers = peopleRes[i].idAnswers;
                    tempAnswer.idQuestions = peopleRes[i].idQuestions;
                    tempAnswer.answer = peopleRes[i].answer;
                    myObj[currentPersonCounter].answerSets[currentAnswerSetCounter].answers.push(tempAnswer);
                }
            }
            httpResponse.json(myObj);
        }
    });
}

exports.getFriends = getFriends;
exports.getFriend = getFriend;