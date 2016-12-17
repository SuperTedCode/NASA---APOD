nasa.service('nasaAPOD', function($http) {
	this.getAPOD = function(callbackOK,URL) {
		//https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY -- Test demo key
		//https://api.nasa.gov/planetary/apod?api_key=WVxxvGH8fOndt5wGc0sLASd4UDnlZ6aSz5w9TeeQ&date=2016-11-12
		$http.get(URL).then(funOK, funNOK);

		function funOK(response) {
		
			callbackOK(response.data);
		};

		function funNOK(response) {
			alert("Error in retreving data from URL: Check console!"+response.data.error.message);
			console.log("Failed URL: "+URL+": -"+response.statusText+" -- "+response.data.error.message);
		};
	}

});


nasa.service('choiceService', function($rootScope) {
	this.setChoice = function(choice) {
		this.choice = choice;	//Sets the value passed to the function it the service variable choice.
		//alert("service setChoice= "+choice);
};
	this.getChoice = function() {
		return this.choice;	//Returns to the controller which called the function the value of its choice variable.
		//alert("Service getChoice= "+choice);
	}
});
