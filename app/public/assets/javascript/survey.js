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
	$.get( "/api/surveys/1", function( data ) {
		console.log(data);
		if(data){

		}
	});
});