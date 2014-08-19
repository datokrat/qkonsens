var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', '../kernaussagemodel'], function(require, exports, unit, kaModel) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.factory = new KernaussageFactory();
        }
        Tests.prototype.test = function () {
            var ka = this.factory.create('Begriff Basisdemokratie');
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var KernaussageFactory = (function () {
        function KernaussageFactory() {
        }
        KernaussageFactory.prototype.create = function (title) {
            var kernaussage = new kaModel.Model();
            kernaussage.title(title);
            return kernaussage;
        };
        return KernaussageFactory;
    })();
});
