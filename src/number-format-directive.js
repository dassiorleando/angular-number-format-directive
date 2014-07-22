(function () {
    'use strict';

    angular.module('cpc.numberFormat', [])
        .directive('cpcNumberFormat', function () {
            function isInvalid(number) {
                return (/[^\d^,^.]/).test(number);
            }

            function unformat(number, decimals) {
                return accounting.unformat(accounting.toFixed(number, decimals));
            }

            function makeParserOrFormatter(ngModel, f, decimals) {
                return function (value) {
                    if (ngModel.$isEmpty(value)) {
                        return value;
                    }

                    if (isInvalid(value)) {
                        ngModel.$setValidity('numberFormat', false);

                        return undefined;
                    }

                    ngModel.$setValidity('numberFormat', true);

                    return f(value, decimals);
                };
            }

            function makeEventHandler(element, ngModel, f, decimals) {
                return function () {
                    var value = element.val();

                    if (ngModel.$invalid || ngModel.$isEmpty(value)) {
                        return;
                    }

                    element.val(f(value, decimals));
                };
            }

            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModel) {
                    var decimals = attrs.decimals || 2;

                    ngModel.$render = function () {
                        if (ngModel.$isEmpty(ngModel.$viewValue)) {
                            return;
                        }

                        element.val(accounting.formatNumber(ngModel.$viewValue, decimals));
                    };

                    ngModel.$formatters.unshift(makeParserOrFormatter(ngModel, accounting.formatNumber, decimals));

                    ngModel.$parsers.unshift(makeParserOrFormatter(ngModel, unformat, decimals));

                    element.on('change blur', makeEventHandler(element, ngModel, accounting.formatNumber, decimals));

                    element.on('focus', makeEventHandler(element, ngModel, unformat, decimals));

                    element.on('$destroy', function () {
                        element.off('change blur focus');
                    });
                }
            };
        });
}());