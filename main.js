var app = angular.module('classificator', ['ngResource', 'ui.router']);

// APP CONFIGURATION
app.config(function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
});

// Router configuration via ui.router. Enables client-side route definition.
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
            .state('classificator', {
                url: "/",
                templateUrl: 'module/classificator/classificator.html',
                controller: 'questions_controller'
            })
            .state('questions', {
                url: "/questions",
                templateUrl: 'module/config/questions/questions.html',
                controller: 'questions_controller'
            })
            .state('answers', {
                url: "/answers",
                templateUrl: 'module/config/answers/answers.html',
                controller: 'answers_controller'
            })
            .state('edit_question', {
                url: "/edit_question/:question_id",
                templateUrl: 'module/config/questions/form.html',
                controller: 'questions_controller'
            })
            .state('create_question', {
                url: "/create_question",
                templateUrl: 'module/config/questions/form.html',
                controller: 'questions_controller'
            });

    $urlRouterProvider.otherwise('/');
});

// APP CONTROLLERS

app.controller('myController', function (myService, $scope) {
    $scope.myData = myService;
    $scope.myData.loadItems();

    $scope.save = function () {
        $scope.myData.saveItem();
    };

    $scope.clear = function () {
        $scope.myData.clearItem();
    };

    $scope.create = function () {
        $scope.myData.createItem($scope.myData.currentItem);
    };

});

app.controller('questions_controller', function (question_service, $stateParams, $state, $scope) {

    $scope.question_data = question_service;
    $scope.question_data.load_items();
    $scope.question_data.current_item = $scope.question_data.get_item($stateParams.question_id);

    $scope.update_question = function () {
        $scope.question_data.update_items();
        $state.go('questions');
    };
    
    $scope.create_question = function () {
        $scope.question_data.current_item = null;
        $scope.question_data.create_items($scope.question_data.current_item);
    };
});

// APP SERVICES

app.service('q_a_service', function (q_a_resource) {
    var self = {
        'list': [],
        'current_item': null,
        'load_items': function () {
            q_a_resource.get(function (response) {
                angular.forEach(response.results, function (item) {
                    console.log(item);
                    self.list.push(new q_a_resource(item));
                });
            });
        },
        'update_items': function () {
            self.current_item.$update();
        },
        'clear_items': function () {
            self.current_item = null;
        }
    };

    return self;
});

app.service('question_service', function (question_resource) {
    var self = {
        'list': [],
        'current_item': null,
        'get_item': function (id) {
            console.log(id);
            for (var i = 0; i < self.list.length; i++) {
                var obj = self.list[i];
                if (obj.id == id) {
                    return obj;
                }
            }
        },
        'load_items': function () {
            question_resource.get(function (response) {
                angular.forEach(response.results, function (item) {
                    console.log(item);
                    self.list.push(new question_resource(item));
                });
            });
        },
        'update_items': function () {
            self.current_item.$update();
        },
        'create_items': function (question) {
            question_resource.save(question);
            self.list = [];
            self.current_item = null;
            self.load_items();
        }
    };
    return self;
});

// APP FACTORIES

app.factory('q_a_resource', function ($resource) {
    return $resource("http://localhost/backend/public/questions_answers/:id", {id: "@id"},
    {
        update: {
            method: "PUT"
        }
    });
});


app.factory('question_resource', function ($resource) {
    return $resource("http://localhost/backend/public/questions/:id", {id: "@id"},
    {
        update: {
            method: "PUT"
        }
    });
});

app.factory('answer_resource', function ($resource) {
    return $resource("http://localhost/backend/public/answers/:id", {id: "@id"},
    {
        update: {
            method: "PUT"
        }
    });
});