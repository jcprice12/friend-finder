// function createUserInfo(){
// 	var myFormGroup = $("<div>");
// 	myFormGroup.addClass("form-group myContainer");
// 	var myContainer = $("<div>");
// 	myContainer.addClass("container-fluid");
// 	var myHeader = $("<h2>");
// 	myHeader.html("About You");
// 	myHeader.addClass("aboutYouHeader");
// 	var myNameGroup = $("<div>");
// 	myNameGroup.addClass("input-group");
// 	var myNameLabel = $("<span>");
// 	myNameLabel.addClass("input-group-addon");
// 	myNameLabel.attr("id", "name-addon");
// 	var myNameInput = $("<input>");
// 	myNameInput.addClass("form-control");
// 	myNameInput.attr("id", "name-input");
// 	myNameInput.attr("placeholder", "John Doe");
// 	myNameInput.attr("type", "text");
// 	myNameInput.attr("aria-describedby", "name-addon");
// 	myNameInput.prop("required", true);
// 	myNameGroup.append(myNameLabel);
// 	myNameGroup.append(myNameInput);
// 	//var my
// 	myContainer.append(myHeader);
// 	myContainer.append(myNameGroup);
// 	myFormGroup.append(myContainer);
// 	return myFormGroup;
// }

// function createForm(){

// }

// function createSurvey(survey){

// }

function compareNumbers(a, b) {
	return a.score - b.score;
}

function getDifference(myAnswersArr, apiAnswer){
	var diff = 0;
	for(var i = 0; i < myAnswersArr.length; i++){
		if(myAnswersArr[i][0] == parseInt(apiAnswer.idQuestions)){
			diff = myAnswersArr[i][1] - parseInt(apiAnswer.answer);
			break;
		}
	}
	diff = diff * diff;
	diff = Math.sqrt(diff);
	console.log(diff);
	return diff;
}

function handleMatches(matches){
	var bestMatch = matches[0];
	$("#modalNameText").text(bestMatch.name);
	$("#modalImage").attr("src", bestMatch.imageUrl);
	$('#myModal').modal('show');
}

function handleEmpty(){

}

$(document).ready(function(){

	$('#myModal').on('hidden.bs.modal', function () {
		$("#modalNameText").html("");
		$("#modalThumb").hide();
	})

	$("#modalImage").on("load", function(){
		$("#modalThumb").show();
		console.log("Image loaded.");
	}).on("error", function(){
		console.log("Error loading image.");
		$("#modalImage").attr("src", "assets/images/placeholder.jpg");
	});

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
				if(dataBack){
					$.get("/api/friends", function(data){
						var scores = [];
						for(var i = 0; i < data.length; i++){
							if(parseInt(data[i].idPeople) != parseInt(dataBack.myId)){
								var thisAnswerSet;
								for(var j = 0; j < data[i].answerSets.length; j++){
									if(data[i].answerSets[j].idSurveys == answerSet.idSurveys){
										thisAnswerSet = data[i].answerSets[j];
										break;
									}
								}
								var personObj = {
									score : 0,
									name : data[i].name,
									imageUrl : data[i].imageUrl,
								}
								for(var j = 0; j < thisAnswerSet.answers.length; j++){
									personObj.score = personObj.score + getDifference(answerSet.answers, thisAnswerSet.answers[j]);
								}
								scores.push(personObj);
							}
						}
						scores.sort(compareNumbers);
						console.log(scores);
						handleMatches(scores);
					}).fail(function(){
						handleEmpty();
					});
				} else {
					handleEmpty();
				}
			}
		})
	})
});