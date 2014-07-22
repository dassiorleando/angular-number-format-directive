describe('number format directive', function () {
    var $scope, $compile;

    beforeEach(module('cpc.numberFormat'));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $scope = _$rootScope_;
        $compile = _$compile_;
    }));

    var compilePicker = function (html, scope) {
        var element = $compile(html)(scope);

        $scope.$digest();

        return element;
    };

    it('should format number when rendered first time', function () {
        $scope.model = 1000;

        var input = compilePicker('<input ng-model="model" cpc-number-format="">', $scope);

        expect(input.val()).toBe('1,000.00');
    });

    it('should unformat number when focused', function () {
        $scope.model = 1000;
        var input = compilePicker('<input ng-model="model" cpc-number-format="">', $scope);

        input.triggerHandler('focus');

        expect(input.val()).toBe('1000');
    });

    it('should format number when value changed and loses focus', function () {
        $scope.model = 1000;
        var input = compilePicker('<input ng-model="model" cpc-number-format="">', $scope);

        input.triggerHandler('focus');
        input.val(2500.50);
        input.triggerHandler('blur');

        expect(input.val()).toBe('2,500.50');
    });

    it('should use the decimals attribute if present instead of the default(2)', function () {
        $scope.model = 1000.822;

        var input = compilePicker('<input ng-model="model" cpc-number-format="" decimals="4">', $scope);

        expect(input.val()).toBe('1,000.8220');
    })
});