var myApp = angular.module('carApp', ['ui.bootstrap', 'trNgGrid']);

myApp.controller('carAppController', ['$http', '$uibModal', function ($http, $uibModal) {
    var scope = this;
    scope.years = [];
    scope.makes = [];
    scope.models = [];
    scope.trims = [];
    scope.cars = [];
    scope.info = [];
    scope.id = {
        id: ''
    };

    scope.options = {
        year: '',
        make: '',
        model: '',
        trim: ''
    };

    scope.getYears = function () {
        $http.get('http://RiaCar.azurewebsites.net/api/cars/GetYears').then(function (response) {

         scope.years = response.data;
        });
    };

    scope.getYears();

    scope.getMakes = function () {
        scope.options.make = "";
        scope.options.model = "";
        scope.options.trim = "";
        scope.cars = [];
        $http.get('http://RiaCar.azurewebsites.net/api/cars/GetMakes', { params: {year: scope.options.year}}).then(function (response) {
            scope.makes = response.data;
            scope.getCars();
        });
    };
   
    scope.getModels = function () {
        scope.options.model = "";
        scope.options.trim = "";
        scope.cars = [];
        $http.get('http://RiaCar.azurewebsites.net/api/cars/GetModels', { params: { year: scope.options.year, make: scope.options.make } }).then(function (response) {
            scope.models = response.data;
            scope.getCars();
        });
    };

    scope.getTrims = function () {
        scope.options.trim = "";
        scope.cars = [];
        $http.get('http://RiaCar.azurewebsites.net/api/cars/GetTrims', { params: { year: scope.options.year, make: scope.options.make, model: scope.options.model } }).then(function (response) {
            scope.trims = response.data;
            scope.getCars();
        });
    }

    scope.getCars = function () {
        $http.get('http://RiaCar.azurewebsites.net/api/cars/GetCars', { params: { year: scope.options.year, make: scope.options.make, model: scope.options.model, trim: scope.options.trim } }).then(function (response) {
            scope.cars = response.data;
        });
    }
    
    //scope.getInfo = function (id) {
    //    scope.id.id = id;
    //    $http.get('http://RiaCar.azurewebsites.net/api/cars/GetInfo', { params: { id: scope.id.id } }).then(function (response) {
    //        scope.info = response.data;
    //    });
    //}

    scope.open = function (id) {
        scope.id.id = id;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'carInfo.html',
            controller: 'infoController as cm',
            size: 'lg',
            resolve: {
                car: function () {
                    return $http.get('http://RiaCar.azurewebsites.net/api/cars/GetInfo', { params: { id: scope.id.id } });
                }
            }
        });
    }
    
}]);

myApp.filter('capitalize', function () {
    return function (token) {
        return token.charAt(0).toUpperCase() + token.slice(1);
    }
});

angular.module('carApp').controller('infoController', function ($uibModalInstance, car) {
    var scope2 = this;
    scope2.car = car.data;
    scope2.ok = function () {
        $uibModalInstance.close();
    };
    scope2.cancel = function () {
        $uibModalInstance.dismiss();
    };
})