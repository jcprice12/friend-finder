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
	$("#submitSurvey").on("click", function(event){
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
			}
		})
	})
});