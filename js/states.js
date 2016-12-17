nasa.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('homeState', {
    url: "/homeUrl",
    templateUrl: 'templates/home.html',
    controller: "homeCtrl"
  })

  .state('settingsState', {
    url: "/settingsUrl",
    templateUrl: 'templates/settings.html',
    controller: "settingsCtrl"
  })

  $urlRouterProvider.otherwise('/homeUrl');
});