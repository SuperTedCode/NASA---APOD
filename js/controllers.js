nasa.controller('homeCtrl', function($scope,$sce,choiceService,nasaAPOD) {
	
//***********************************************************************************************************

//As the video url is from another domain 'youtube' it needs tobe referenced as a trusted source.
//Strict Contextual Escaping (SCE) is a mode in which AngularJS requires bindings in certain contexts 
//to result in a value that is marked as safe to use for that context
$scope.trustSrc = function(src) { //this function is called in the home.html when a video is retreived and its source added to the function calls parameter.
				return $sce.trustAsResourceUrl(src);
			};
//*************************************************************************************************************


	$scope.$on('$ionicView.beforeEnter',function() { // Ensures the code below is run when the home page is loaded.
		$scope.choice = choiceService.getChoice(); 	//get The value of $scope.choice from the service which was updated from settings ctrl
		if($scope.choice == undefined) {			//on startup the settings page will not have been loaded yet and so choice will be undefined in the service
			$scope.choice = 1;						//As we want to start with todays picture we set the value to 1 to run the 1st case in the switch statement.
			//alert("It was undefined so Ctrl set scopechoice to 1")
		}
		//alert("homeCtrl choice = "+$scope.choice);

	var toDay = new Date(); //Get current date on startup.
	var y = toDay.getFullYear();
	var m = toDay.getMonth()+1;
	var d = toDay.getDate();
	var weekDay = toDay.getDay(); //Week day is needed so we can know when its Sunday and skip it.
	var dateString = "&date="+y+"-"+m+"-"+d; // builds the string needed to add the date option to the URL
	var oneDay = 1000*60*60*24; //Get amount milliseconds in a day to sub from a date.
	var URL = "https://api.nasa.gov/planetary/apod?api_key=WVxxvGH8fOndt5wGc0sLASd4UDnlZ6aSz5w9TeeQ"+ dateString;

	
		switch($scope.choice) {
			case 1:
				$scope.nasaData = []; // The array needs to be cleared empty each time so remove the previous data.
				$scope.APOD = nasaAPOD.getAPOD(function(data) {
				$scope.nasaData.push(data);
				},URL) //URL here is current date, Date could be left out as by default it would return current day object.
				break;
			case 7:
				$scope.nasaData = [];
				for(var i=0;i<7;i++) { //loop through 7 days
					if(weekDay==0) { //Nasa does not release a link for Sunday so this if statment will update the date when its sunday.
						toDay = new Date(toDay-oneDay); // Move from sunday back a day to Sat. WE still want the result as a date obj to get Y,M,D for string.
						y = toDay.getFullYear(); // reset the year,month and date for the URL for each loop
						m = toDay.getMonth()+1;
						d = toDay.getDate();
						weekDay = toDay.getDay(); //reset the weekDay so it corresponds to the right date in each loop.
						dateString = y+"-"+m+"-"+d;

						URL = URL.slice(0,90);	//remove the year,month and date from the url
						URL+=dateString; //add in the new year,month and date to the url string
					}
					
					$scope.APOD = nasaAPOD.getAPOD(function(data) { //call the service with the URL passed in and push the returned data into the array nasaData.
						$scope.nasaData.push(data);
						//console.log($scope.nasaData);
						$scope.nasaData.sort(function(a, b) {		//sort the array AFTER EACH data object is entered into it from the service.
						//console.log("Hello from case 7 sort nasaData");
						//console.log(a.date +" - "+b.date);
						return new Date(b.date).getDate() - new Date(a.date).getDate(); //Have to convert the date string property values of each obj to a date that...
						}); //...can be substracted. If it returns a - the objects are reversed.
					},URL)

					toDay = new Date(toDay-oneDay); // When its not a Sunday and the current date obj is passed in we neeed to reset the date values to previous day
					y = toDay.getFullYear();
					m = toDay.getMonth()+1;
					d = toDay.getDate();
					weekDay = toDay.getDay();
					dateString = y+"-"+m+"-"+d;

					URL = URL.slice(0,90);	//remove the date from the url
					URL+=dateString;
				}
				//console.log($scope.nasaData);
				//$scope.nasaData.sort(function(a, b) {
				//	console.log("Hello from case 7 sort nasaData");
				//	return a.date - b.date;
				//	
				//});
				break;
			case 14:
				$scope.nasaData = [];
				for(var i=0;i<14;i++) {
					if(weekDay==0) { //Nasa does not release a link for Sunday so this if statment will update the date.
						toDay = new Date(toDay-oneDay); // Move from sunday back a day to Sat.
						y = toDay.getFullYear(); // reset the year,month and date for the URL
						m = toDay.getMonth()+1;
						d = toDay.getDate();
						weekDay = toDay.getDay();
						dateString = y+"-"+m+"-"+d;

						URL = URL.slice(0,90);	//remove the year,month and date from the url
						URL+=dateString; //add in the new year,month and date to the url string
					}

					$scope.APOD = nasaAPOD.getAPOD(function(data) { //call the service with the URL passed in and push the returned data into the array nasaData.
						$scope.nasaData.push(data);
						
						$scope.nasaData.sort(function(a, b) {		//sort the array AFTER each data object is entered into it from the service.
						//console.log("Hello from case 14 sort nasaData");
						//console.log(a.date +" - "+b.date);
						return new Date(b.date).getDate() - new Date(a.date).getDate();
						
						}); 
					},URL)

					toDay = new Date(toDay-oneDay);
					y = toDay.getFullYear();
					m = toDay.getMonth()+1;
					d = toDay.getDate();
					weekDay = toDay.getDay();
					dateString = y+"-"+m+"-"+d;

					URL = URL.slice(0,90);	//remove the date from the url
					URL+=dateString;
				}
				//alert("Hello from case 14");
				$scope.nasaData.sort(function(a, b) {
					return a.date - b.date;
					alert("Hello from case 14 sort nasaData");
				});
				break;
			default:
				alert("displaying default");
				$scope.nasaData = [];
				$scope.APOD = nasaAPOD.getAPOD(function(data) {
				$scope.nasaData.push(data);
				},URL);
		}
	});
	
});

//*************************************************************************************************************************************************************************
//*************************************************************************************************************************************************************************
//*************************************************************************************************************************************************************************

nasa.controller('settingsCtrl', function($scope, choiceService) {

	$scope.$on('$ionicView.beforeEnter',function(){ //When the page view is loaded the follow code will be run.
		
		$scope.choice = choiceService.getChoice(); //like in the home page we check in the settings page for its setting ctrl $scope choice variable value.
		//alert("controller getChoice from service "+$scope.choice);
		if($scope.choice == undefined) {
			$scope.choice = 1;
			//alert("It was undefined so Ctrl set scopechoice to 1")
		}
		

		//alert("Ctrl $scope.choice= "+$scope.choice);
		$scope.update = function(choice) { //when a setting value is selected, it is passed to the service so when a user enters the home page it will...
		choiceService.setChoice(choice);   //.... retrieve the new value of choice in the same service and update the $scope variable choice in the home ctrl
		//alert("controller update choice");

	}

	});

	
});








