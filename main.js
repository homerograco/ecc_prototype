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
                controller: 'classificator_controller'
            })
            .state('questions', {
                url: "/questions",
                templateUrl: 'module/config/questions/questions.html',
                controller: 'edit_controller'
            })
            .state('answers', {
                url: "/answers",
                templateUrl: 'module/config/answers/answers.html',
                controller: 'edit_controller'
            })
            .state('edit_question', {
                url: "/edit_question/:question_id",
                templateUrl: 'module/config/questions/form.html',
                controller: 'edit_controller'
            })
            .state('edit_answer', {
                url: "/edit_answer/:answer_id",
                templateUrl: 'module/config/answers/form.html',
                controller: 'edit_controller'
            })
            .state('create_question', {
                url: "/create_question",
                templateUrl: 'module/config/questions/form.html',
                controller: 'create_controller'
            })
            .state('create_answer', {
                url: "/create_answer",
                templateUrl: 'module/config/answers/form.html',
                controller: 'create_controller'
            });

    $urlRouterProvider.otherwise('/');
});

// APP CONTROLLERS

app.controller('create_controller', function (db_service, $state, $scope) {

    $scope.mode = "create";

    $scope.db_data = db_service;
    $scope.db_data.current_question = null;
    $scope.db_data.current_answer = null;

    $scope.create_question = function () {
        $scope.db_data.create_questions($scope.db_data.current_question);
        $scope.db_data.load_questions();
        $scope.db_data.current_question = null;
        $state.go('questions');
    };
    
    $scope.create_answer = function () {
        $scope.db_data.create_answers($scope.db_data.current_answer);
        $scope.db_data.load_answers();
        $scope.db_data.current_answer = null;
        $state.go('answers');
    };
});

app.controller('edit_controller', function (db_service, $stateParams, $state, $scope) {

    $scope.mode = "edit";

    $scope.db_data = db_service;
    $scope.db_data.load_questions();
    $scope.db_data.load_answers();
    $scope.db_data.current_question = $scope.db_data.get_question($stateParams.question_id);
    $scope.db_data.current_answer = $scope.db_data.get_answer($stateParams.answer_id);

    $scope.update_question = function () {
        $scope.db_data.update_questions();
        $state.go('questions');
    };
    
    $scope.update_answer = function () {
        $scope.db_data.update_answers();
        $state.go('answers');
    };

    $scope.delete_question = function () {
        $scope.db_data.delete_questions();
        $scope.db_data.load_questions();
        $state.go('questions');
    };
    
    $scope.delete_answer = function () {
        $scope.db_data.delete_answers();
        $scope.db_data.load_answers();
        $state.go('answers');
    };
});

app.controller('classificator_controller', function (classificator_service, $scope) {
    $scope.classificator_data = classificator_service;
    $scope.classificator_data.load();
});

// APP SERVICES

app.service('db_service', function (db_resource) {
    var self = {
        'questions_list': [],
        'answers_list': [],
        'current_question': null,
        'current_answer': null,
        'get_question': function (id) {
            console.log(id);
            for (var i = 0; i < self.questions_list.length; i++) {
                var obj = self.questions_list[i];
                if (obj.id == id) {
                    return obj;
                }
            }
        },
        'get_answer': function (id) {
            console.log(id);
            for (var i = 0; i < self.answers_list.length; i++) {
                var obj = self.answers_list[i];
                if (obj.id == id) {
                    return obj;
                }
            }
        },
        'load_questions': function () {
            db_resource.questions.get(function (response) {
                angular.forEach(response.results, function (item) {
                    console.log(item);
                    self.questions_list.push(new db_resource.questions(item));
                });
            });
        },
        'load_answers': function () {
            db_resource.answers.get(function (response) {
                angular.forEach(response.results, function (item) {
                    console.log(item);
                    self.answers_list.push(new db_resource.answers(item));
                });
            });
        },
        'update_questions': function () {
            self.current_question.$update();
        },
        'update_answers': function () {
            self.current_answer.$update();
        },
        'create_questions': function (item) {
            db_resource.questions.save(item);
        },
        'create_answers': function (item) {
            db_resource.answers.save(item);
        },
        'delete_questions': function () {
            self.current_question.$remove();
        },
        'delete_answers': function () {
            self.current_answer.$remove();
        }
    };
    return self;
});

app.service('classificator_service', function (classificator_resource) {
    var self = {
        'list': [],
        'load': function () {
            classificator_resource.get(function (response) {
                angular.forEach(response.results, function (item) {
                    console.log(item);
                    self.list.push(new classificator_resource(item));
                });
            });
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

app.factory('db_resource', function ($resource) {
    return {
        questions: $resource("http://localhost/backend/public/questions/:id", {id: "@id"},
        {
            update: {
                method: "PUT"
            }
        }),
        answers: $resource("http://localhost/backend/public/answers/:id", {id: "@id"},
        {
            update: {
                method: "PUT"
            }
        })
    };
});

app.factory('classificator_resource', function ($resource) {
    return $resource("http://localhost/backend/public/classificator/:code", {code: "@code"},
    {
        update: {
            method: "PUT"
        }
    });
});