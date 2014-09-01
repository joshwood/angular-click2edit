angular.module('widget-demo-app', ['ngSanitize', 'ui.select', 'widgets']);
angular.module('widget-demo-app').controller('WidgetsController', ['$scope', function($scope){
    $scope.widgets = {};
    $scope.widgets.dummy = {
        offering1:{
            desc: "Dummy Offering 1",
            enabled: false
        },
        offering2:{
            desc: "Dummy Offering 2",
            enabled: true
        },
        assignedPerson:{
            name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador'
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
        ]

    };
}]);

angular.module('widgets', ['ngSanitize', 'ui.select']);
angular.module('widgets').directive('clickToEdit', function ($timeout, $parse) {
    return {
        restrict: 'AE',
        transclude: true,
        replace: false,
        scope:true,
        template:
            '<div class="templateRoot">'+
                '<div class="hover-edit-trigger" title="click to edit">'+
                    '<div class="hover-text-field" ng-click="showEdit()" ng-enter="save()">'+
                        '<div style="display:inline-block" ng-transclude></div>'+
                        '<span ng-show="!rProps.editMode">'+
                            '<div class="edit-pencil glyphicon glyphicon-pencil"></div>'+
                        '</span>'+
                    '</div>'+
                '</div>'+
                '<div class="edit-button-group pull-right" ng-show="rProps.editMode">'+
                    '<div class="glyphicon glyphicon-ok" ng-click="save()"></div>'+
                    '<div class="glyphicon glyphicon-remove" ng-click="cancel()"></div>'+
                '</div>'+
            '</div>',
        controller: function($scope){
            /*
             * wrapper object for our properties
             */
            $scope.rProps={
                editMode : false
            };
            /*
             * exposes our scope to our children
             */
            this.scope = function(){
                return $scope;
            };
            /*
             * method for edit child to call when it finds the model
             */
            this.tellMeTheModel = function(model){
                $scope.rProps.modelString = model;
                $scope.rProps.rollbackValue = $scope.$parent.$eval(model);
                //console.log($scope.rProps.rollbackValue);
            };
        },
        link: function(scope, element){
            /*
             * simple toggle of view modes
             */
            scope.toggle = function(){
                scope.rProps.editMode = !scope.rProps.editMode;
            };
            /*
             * update our rollback value when saved
             * wasn't aware of $parse til just now - needed to update objects(was using eval for primitives)
             * http://stackoverflow.com/questions/16494457/how-to-set-an-interpolated-value-in-angular-directive
             */
            scope.save = function(){
                var model = $parse(scope.rProps.modelString);
                scope.rProps.rollbackValue = model(scope);
                scope.toggle();
            };
            /*
             * reverts to original value
             * wasn't aware of $parse til just now - needed to update objects(was using eval for primitives)
             * http://stackoverflow.com/questions/16494457/how-to-set-an-interpolated-value-in-angular-directive
             */
            scope.cancel = function(){
                var model = $parse(scope.rProps.modelString);
                model.assign(scope, scope.rProps.rollbackValue);
                scope.toggle();
            };
            /*
             * goofy hack to make sure clicking the field while in edit mode doesn't trigger toggle
             */
            scope.showEdit=function(){
                if(!scope.rProps.editMode) scope.toggle();
            };
            /*
             * watch our editmode and update transcluded content (wasn't sure how to dynamically add ng-show)
             */
            scope.$watch('rProps.editMode', function(){
                scope.updateElements();
            });
            /*
             * little hackish, we want to the hover border to be constant during edit mode
             */
            scope.updateElements = function(){
                angular.element(element[0].querySelector(".hover-edit-trigger")).toggleClass('editBorder', scope.rProps.editMode);
            };

        }
    }
});
angular.module('widgets').directive('displayMode', function () {
    return {
        require: '^clickToEdit',
        restrict: 'AE',
        link: function(scope, element, attrs, cntrl){
            /*
             * watch "parent" scope for editMode changes and toggle accordingly
             */
            cntrl.scope().$watch('rProps.editMode',function(editMode){
                element.toggleClass('hideMode', editMode);
            });

        }
    }
});
angular.module('widgets').directive('editMode', function ($timeout) {
    return {
        require: '^clickToEdit',
        restrict: 'AE',
        link: function(scope, element, attrs, cntrl){

            /*
             * watch "parent" scope for editMode changes and toggle accordingly
             */
            cntrl.scope().$watch('rProps.editMode',function(editMode){

                /*
                 * hide or show ourselves
                 */
                element.toggleClass('hideMode', !editMode);

                /*
                 * look for an element to focus on
                 */
                tryToFocus();

                /*
                 * look for the 'clickMe' class and click it
                 */
                tryToClick();

            });

            /*
             * dig through the edit elements to find the !!FIRST!! element with an ng-model attribute
             * so the controller can keep up with it. that's the best I can do without making the user
             * add some kind of extra attribute or a duplicate reference to ng-model on the root.
             * ui-select has multiple ng-model(s) which pointed out this issue
             */
            var modelEl = searchForModelElement(element);
            cntrl.tellMeTheModel(modelEl.attr('ng-model'));

            /*
             * walks through the children looking for the first element with ng-model
             */
            function searchForModelElement(el){
                if(el.attr('ng-model')){
                    return el;
                }
                angular.forEach(el.children(), function(x){
                    var el = angular.element(x);
                    searchForModelElement(el);
                });
            }

            /*
             * try to find something to focus on, nice for text fields
             */
            function tryToFocus(){
                var focusOnMe = element.hasClass('ng-valid') ? element[0] : element[0].querySelector('.ng-valid');
                focusOnMe ? focusOnMe.focus() : angular.noop;
            }

            /*
             * we'll look for something to click, used to expand things like a ui-select element
             */
            function tryToClick(){
                var clicker = element.hasClass('clickMe') ? element[0] : element[0].querySelector('.clickMe');
                $timeout(function(){
                    angular.element(clicker).triggerHandler('click');
                }, 0);
            }
        }
    }
});


/*
 * seriously i would have never thought of this on my own, i don't think in directives yet
 * http://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
 */
angular.module('widgets').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
/*
 * ripped from example
 * http://stackoverflow.com/questions/12592472/how-to-highlight-a-current-menu-item-in-angularjs
 */
angular.module('widgets').directive('activeLink', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var clazz = attrs.activeLink;
            var path = attrs.when;
            scope.location = location;
            scope.$watch('location.path()', function(newPath) {
                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }
    };
}]);

angular.module('widgets').filter('propsFilter', function() {
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
