var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../observable'], function(require, exports, unit, test, Obs) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.test = function () {
            var o = new Obs.ObservableArrayExtender(ko.observableArray());
            var ctr = 0;
            o.pushed.subscribe(function (num) {
                return test.assert(function () {
                    return ctr++ == 0;
                });
            });
            o.push(1);
            test.assert(function () {
                return ctr == 1;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
