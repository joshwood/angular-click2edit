/*
 * inject our widgets and the ui-select stuff for the demo
 */
angular.module('widget-demo-app', ['ngSanitize', 'ui.select', 'widgets']);

/*
 * simple controller for our demo
 */
angular.module('widget-demo-app').controller('WidgetsController', ['$scope', function($scope){
    $scope.widgets = {};
    $scope.widgets.dummy = {
        sprint:{
            desc: "Learn directives",
            completed: false,
            assignedPerson:{
                name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador'
            }        
        },
        people : [
            { name: 'Adam',      email: 'adam@email.com',      age: 12, country: 'United States' },
            { name: 'Amalie',    email: 'amalie@email.com',    age: 12, country: 'Argentina' },
            { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
            { name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador' },
            { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30, country: 'Ecuador' },
            { name: 'Samantha',  email: 'samantha@email.com',  age: 30, country: 'United States' },
            { name: 'Nicole',    email: 'nicole@email.com',    age: 43, country: 'Colombia' },
            { name: 'Natasha',   email: 'natasha@email.com',   age: 54, country: 'Ecuador' },
            { name: 'Michael',   email: 'michael@email.com',   age: 15, country: 'Colombia' },
            { name: 'Nicolás',   email: 'nicole@email.com',    age: 43, country: 'Colombia' }
        ],
        statusOptions:[
            {status: false, label: "No"},
            {status: true, label: "Yes"}
        ]
    };
}]);

/*
 * used for ui-select search in the demo, should not be part of the distribution
 * so we're putting it here.
 */
angular.module('widget-demo-app').filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});
