var app = angular.module('foo', ['ngResource']);
//alert("test");

app.config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
});

app.controller('myController', function(myService, $scope) {
    $scope.myData = myService;
    $scope.myData.loadItems();
    
    $scope.save = function(){
        myService.saveItem(); 
    };
});

app.service('myService', function (dataResource) {
    var self = {
        'list': [],
        'currentItem': {},
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
            }
        };
    return self;
    }
);

app.factory('dataResource', function ($resource) {

    return $resource("http://localhost/slim_app_2/slim_app_2/public/all/:id", {id: "@id"},
    {
        update: {
            method: "PUT"
        }
    });
});

