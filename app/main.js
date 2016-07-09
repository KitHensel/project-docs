import "../dist/templates";
import "./layout";
import "./shared";
import "./side-nav";

import docs from "./docs/_docs"

const DEPENDENCIES = [
  'ui.router',
  'templates',
  'app.layout',
  'app.shared',
  'app.sideNav'
];

angular
  .module('app', DEPENDENCIES)
  .config(($stateProvider, $urlRouterProvider, $locationProvider) => {
    
    $locationProvider.html5Mode(true);
    
    $stateProvider.state('app', {
      abstract: true,
      templateUrl: 'layout/app-layout.html'
    });

    //set the state route and template for each doc
    docs.forEach(doc => {
      $stateProvider.state('app.' + doc, {
        url: '/' + doc,
        templateUrl: 'docs/' + doc + ".doc.html",
        title: doc,
        controller: function($scope, $timeout){
          $scope.$on('$viewContentLoaded', (event, nextState) => {
            $timeout(function() {
              Prism.highlightAll(); //highlight new code tags
            }, 0);
          });
        } 
      })
    });

    $urlRouterProvider.otherwise('/project-docs');
  })
  .run($rootScope => {
    //track all compiled header directives.
    $rootScope.sideNavs = [];

    $rootScope.$on('$stateChangeStart', function(event, nextState){ 
      //clear out list of header directives that drive side-nav
      $rootScope.sideNavs = [];
    })

    $rootScope.$on('$stateChangeSuccess', (event, nextState) => {
      $rootScope.title = nextState.title;
    });
  })

angular.bootstrap(document, ['app']);