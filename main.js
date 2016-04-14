var app = angular.module('classificator', ['ngResource']);

// APP CONFIGURATION
app.config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
});


// APP CONTROLLERS

app.controller('myController', function(myService, $scope) {
    $scope.myData = myService;
    $scope.myData.loadItems();
    
    $scope.save = function() {
        $scope.myData.saveItem();  
    };
    
    $scope.clear = function() {
        $scope.myData.clearItem();
    };
    
    $scope.create = function() {
        $scope.myData.createItem($scope.myData.currentItem);
    };
    
});

app.controller('q_a_controller', function(q_a_service, $scope) {
    $scope.q_a_data = q_a_service;
    $scope.q_a_data.load_items();
    
    $scope.update = function() {
        $scope.q_a_data.update_items();
    };
    
    $scope.clear = function() {
        $scope.q_a_data.clear_items();
    };
});

// APP SERVICES

app.service('myService', function (dataResource) {
    var self = {
        'list': [],
        'currentItem': null,
        'loadItems': function() {
            dataResource.get(function (response) {
                angular.forEach(response.results, function(item) {
                    console.log(item);
                    self.list.push(new dataResource(item));
                });
            });
        },
        'saveItem': function() {
            self.currentItem.$update();
            },
        'clearItem': function() {
            self.currentItem = null;
        },
        'createItem': function(data) {
            self.currentItem.save(data);
        }
        };
    return self;
    }
);

app.service('q_a_service', function(q_a_resource) {
    var self = {
        'list': [],
        'current_item': null,
        'load_items': function() {
            q_a_resource.get(function(response) {
               angular.forEach(response.results, function(item) {
                   console.log(item);
                   self.list.push(new q_a_resource(item));
               });
            });
        },
        'update_items': function() {
            self.current_item.$update();
        },
        'clear_items': function() {
            self.current_item = null;
        }
    };
    
    return self;
});

// APP FACTORIES

app.factory('dataResource', function ($resource) {

    return $resource("http://localhost/backend/public/all/:id", {id: "@id"},
    {
        update: {
            method: "PUT"
        }
    });
});

app.factory('q_a_resource', function ($resource) {
    return $resource("http://localhost/backend/public//questions_answers/:code", {code: "@code"},
    {
        update: {
            method: "PUT"
        }
    });
});

