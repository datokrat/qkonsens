var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/testratingcommunicator'], function(require, exports, unit, RatingCommunicator) {
    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
        }
        TestClass.prototype.test = function () {
            var com = new RatingCommunicator();
        };
        return TestClass;
    })(unit.TestClass);

    
    return TestClass;
});
