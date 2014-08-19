var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var TestErrorBase = (function () {
        function TestErrorBase() {
        }
        TestErrorBase.prototype.toString = function () {
            return JSON.stringify(this);
        };
        return TestErrorBase;
    })();
    exports.TestErrorBase = TestErrorBase;

    var TestError = (function (_super) {
        __extends(TestError, _super);
        function TestError(message) {
            _super.call(this);
            this.message = message;
        }
        TestError.prototype.toString = function () {
            return "TestError: " + this.message;
        };
        return TestError;
    })(TestErrorBase);
    exports.TestError = TestError;

    function assert(condition) {
        if (!condition())
            throw new TestError("assert: " + getFnBody(condition));
    }
    exports.assert = assert;

    function assertThrows(action) {
        var throwed = false;
        try  {
            action();
        } catch (e) {
            throwed = true;
        }
        if (!throwed)
            throw new TestError("assertThrows");
    }
    exports.assertThrows = assertThrows;

    function getFnBody(fn) {
        var str = fn.toString();
        return str.substr(37, str.length - 52);
    }
});
