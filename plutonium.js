/* global View, Showdown, shapeArray, markdownit */

var angular = angular || {};



angular.module('plutonium', ['ui.router', 'ngResource']);
angular.module('plutonium');

var drawHexagon = (function $drawHexagon() {
  var drawn = false;
  var svg;
  return function(el) {
    if (!drawn) {
      var v = View({ target: el });
      shapeArray(v, { radius: 60, pad: -35, range: [3, 6]  });
      svg = el.children[0];
      drawn = true;
    } else {
      el.appendChild(svg);
    }
  };
})();

angular.module('plutonium').filter('markdown', function() {
  var md = markdownit();
  return function(text) {
    console.log(text);
    return md.render(text);
  };
});

angular.module('plutonium').directive('plHexagon', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'dir.hexagon.html',
    controller: [
      '$scope', '$state', '$element',
      function($scope, $state, $element) {
        drawHexagon($element.children()[0]);
      }
    ]
  };
});


angular.module('plutonium').directive('plBlogTeaser', function() {
  return {
    retrict: 'E',
    scope: false,
    templateUrl: 'dir.blog-teaser.html',
    controller: [
      '$scope', 'models',
      function($scope, models) {
      }
    ]
  };
});

angular.module('plutonium').directive('plBlogItems', function() {
  return {
    retrict: 'E',
    scope: false,
    templateUrl: 'dir.blog-items.html',
    controller: [
      '$scope', 'models',
      function($scope, models) {
        $scope.blogs = models.Blog.query();
      }
    ]
  };
});

angular.module('plutonium').factory('markdown', [
  '$sce',
  function($sce) {
    var converter = new Showdown.converter(); 
    return function(str) {
      if (str) {
        return $sce.trustAsHtml(converter.makeHtml(str));
      } else {
        return '';
      }
    };
  }
]);

angular.module('plutonium').directive('plBlogItem', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'dir.blog-item.html',
    controller: [
      '$scope', '$state', 'models', 'markdown',
      function($scope, $state, models, markdown) {
        $scope.markdown = markdown;
      }
    ]
  };
});

angular.module('plutonium').directive('plBlog', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'dir.blog.html',
    controller: [
      '$scope', '$state', '$stateParams', 'models',
      function($scope, $state, $stateParams, models) {
        if ($stateParams.id) {
          $scope.blog = models.Blog.get({ id: $stateParams.id });
          
          $scope.blog.$promise.then(function(){
          }).catch(function(e) {
            $state.go('root.404');
          });


        } else {
          $scope.blogs = models.Blog.query();
        }

        window.s = $scope;
      }
    ]
  };
});

angular.module('plutonium').factory('models', [
  '$resource',
  function($resource) {
    var models = {};

    models.Blog = $resource('http://127.0.0.1:3000/api/blogs/:id');

    window.m = models;

    return models;
  }
]);

angular.module('plutonium').directive('plTitle', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'dir.title.html',
    controller: [
      '$scope', '$state',
      function($scope, $state) {
        window.$s = $state;
        $scope.$state = $state;
      }
    ]

  };
});

angular.module('plutonium').directive('plNav', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'dir.nav.html',
    controller: [
      '$scope', '$state',
      function($scope, $state) {
      }
    ]

  };
});

angular.module('plutonium').controller('PlCtrl', [
  '$scope', '$rootScope', '$state',
  function($scope, $rootScope, $state) {
    $scope.$state = $state;
    
    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams) {
      $scope.location = $state.href(toState.name, toParams);
      if (!$scope.location) {
        $scope.location = window.location.href.toString().replace(
                            window.location.origin + '/', ''
                          );
      }
    });
  }
]);

angular.module('plutonium').config([
  '$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);

    $stateProvider
      .state('root', {
        url: null,
        templateUrl: 'view.root.html'
      })
      .state('root.home-empty', {
        url: '',
        templateUrl: 'view.home.html'
      })
      .state('root.home', {
        url: '/',
        templateUrl: 'view.home.html'
      })
      .state('root.blog-empty', {
        url: '/blog',
        templateUrl: 'view.blog.html'
      })
      .state('root.blog', {
        url: '/blog/:id',
        templateUrl: 'view.blog.html'
      })
      .state('root.projects', {
        url: '/projects/:id',
        templateUrl: 'view.projects.html'
      })
      .state('root.projects-empty', {
        url: '/projects',
        templateUrl: 'view.projects.html'
      })
      .state('root.404', {
        templateUrl: 'view.404.html'
      })
    ;

    $urlRouterProvider.otherwise(function($injector, $location) {
      $injector.invoke(['$state', function($state) {
        $state.go('root.404');
        console.log($location);
        $state.location = $location;
      }]);
    });
  }
]);
