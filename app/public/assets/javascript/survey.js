function createUserInfo(){
	var myFormGroup = $("<div>");
	myFormGroup.addClass("form-group myContainer");
	var myContainer = $("<div>");
	myContainer.addClass("container-fluid");
	var myHeader = $("<h2>");
	myHeader.html("About You");
	myHeader.addClass("aboutYouHeader");
	var myNameGroup = $("<div>");
	myNameGroup.addClass("input-group");
	var myNameLabel = $("<span>");
	myNameLabel.addClass("input-group-addon");
	myNameLabel.attr("id", "name-addon");
	var myNameInput = $("<input>");
	myNameInput.addClass("form-control");
	myNameInput.attr("id", "name-input");
	myNameInput.attr("placeholder", "John Doe");
	myNameInput.attr("type", "text");
	myNameInput.attr("aria-describedby", "name-addon");
	myNameInput.prop("required", true);
	myNameGroup.append(myNameLabel);
	myNameGroup.append(myNameInput);
	//var my
	myContainer.append(myHeader);
	myContainer.append(myNameGroup);
	myFormGroup.append(myContainer);
	return myFormGroup;
}

function createForm(){

}

function createSurvey(survey){

}

$(document).ready(function(){
	// $.get( "/api/surveys/1", function( data ) {
	// 	console.log(data);
	// 	if(data){

	// 	}
	// });
	$("#myForm").submit(function(event){
		event.preventDefault();

		var myFormData = {};

		var person = {};
		person.name = $("#personName").val().trim();
		person.imageUrl = $("#imageUrl").val().trim();

		var answerSet = {};
		answerSet.idSurveys = parseInt($("#myForm").attr("data-idSurveys"));
		answerSet.answers = [];

		var questions = document.getElementsByClassName("question");
		var tempAnswer;
		for(var i = 0; i < questions.length; i++){
			tempAnswer = [];
			tempAnswer.push(parseInt($(questions[i]).attr("data-idQuestions")));
			tempAnswer.push(parseInt($(questions[i]).val()));
			answerSet.answers.push(tempAnswer);
		}

		myFormData.person = person;
		myFormData.answerSet = answerSet;
		console.log(myFormData);
		$.ajax({
			type: "POST",
			url : "/api/friends",
			data : myFormData,
			dataType : "json",
			success : function(dataBack){
				console.log(dataBack);
				var currentBest = {
					"score" : null,
					"name" : null,
					"imageUrl" : null
				};
				var currentUserId = -1;
				var currentScore;
				for(var i = 0; i < dataBack.length; i++){
					if(currentUserId !== dataBack[i].idPeople){
						currentUserId = dataBack[i].idPeople;
						currentScore = 0;				
					}
					for(var j = 0; j < answerSet.answers.length; j++){
						if(answerSet.answers[j][0] === parseInt(dataBack[i].idQuestions)){
							var diff = answerSet.answers[j][1] - parseInt(dataBack[i].answer);
							diff = (diff * diff);
							diff = Math.sqrt(diff);
							currentScore += diff;
							break;
						}
					}
					if(currentBest["score"]){
						if(currentScore <= currentBest["score"]){
							currentBest["score"] = currentScore;
							currentBest["name"] = dataBack[i].name;
							currentBest["imageUrl"] = dataBack[i].imageUrl;
						}
					} else {
						currentBest["score"] = currentScore;
						currentBest["name"] = dataBack[i].name;
						currentBest["imageUrl"] = dataBack[i].imageUrl;
					}
					
				}
				console.log(currentBest);
			}
		})
	})
});