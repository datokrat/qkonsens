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
            LocationHash.reset();
            var subscription = LocationHash.changed.subscribe(function (hash) {
                counter.inc('changed');
            });
            location.hash = Math.random().toString();
            setTimeout(cb(function () {
                subscription.dispose();
                location.hash = '';
                test.assert(function (v) { return v.val(counter.get('changed')) == 1; });
                r();
            }), 500);
        };
        Tests.prototype.decodeCorrectly = function (async, r, cb) {
            async();
            var counter = new Common.Counter();
            LocationHash.reset();
            var subscription = LocationHash.changed.subscribe(function (hash) {
                counter.inc('changed');
                test.assert(function (v) { return v.val(hash) == '#"'; });
            });
            location.hash = '"';
            setTimeout(cb(function () {
                subscription.dispose();
                location.hash = '';
                test.assert(function (v) { return v.val(counter.get('changed')) == 1; });
                r();
            }), 500);
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
