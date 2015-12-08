var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'tests/test', '../common', '../locationhash'], function (require, exports, unit, test, Common, LocationHash) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.change = function (async, r, cb) {
            async();
            var counter = new Common.Counter();
            var subscription = LocationHash.changed.subscribe(function (hash) {
                counter.inc('changed');
                console.log('ok');
            });
            location.hash = Math.random().toString();
            setTimeout(cb(function () {
                test.assert(function (v) { return v.val(counter.get('changed')) == 1; });
                subscription.dispose();
                location.hash = '';
                r();
            }), 500);
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
