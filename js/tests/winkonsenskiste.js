var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../konsenskistemodel', 'windows/konsenskiste', 'windows/konsenskistecontroller', 'tests/testkonsenskistecommunicator', '../viewmodelcontext', '../kernaussagemodel'], function(require, exports, unit, test, kokiMdl, win, ctr, KokiCommunicator, ViewModelContext, kaMdl) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.setUp = function () {
            this.konsenskisteModel = new kokiMdl.Model();
            this.window = new win.Win();
            this.controller = new ctr.Controller(this.konsenskisteModel, this.window, new KokiCommunicator.Main);
        };

        Tests.prototype.tearDown = function () {
            this.controller.dispose();
        };

        Tests.prototype.testKkView = function () {
            var _this = this;
            this.konsenskisteModel.general().title('Title');

            test.assert(function () {
                return _this.window.kkView().general().title() == 'Title';
            });
            test.assert(function () {
                return _this.window.kkView().childKas != null;
            });
        };

        Tests.prototype.testSetKonsenskisteModel = function () {
            var _this = this;
            var newModel = new kokiMdl.Model;

            var currentTitle = ko.computed(function () {
                return _this.window.kkView().general().title();
            });

            this.konsenskisteModel.general().title('Alt');
            newModel.general().title('Neu');
            this.controller.setKonsenskisteModel(newModel);
            test.assert(function () {
                return currentTitle() == 'Neu';
            });
            newModel.general().title('Basisdemokratie');
            test.assert(function () {
                return currentTitle() == 'Basisdemokratie';
            });
        };

        Tests.prototype.testNullModel = function () {
            try  {
                var window = new win.Win;
                var controller = new ctr.Controller(null, window, new KokiCommunicator.Main);
            } finally {
                controller && controller.dispose();
            }
        };

        Tests.prototype.testAComplexUseCase = function () {
            var _this = this;
            var ka = new kaMdl.Model();
            this.konsenskisteModel.childKas.push(ka);

            this.konsenskisteModel.general().title('Basisdemokratie');
            ka.general().title('Begriff Basisdemokratie');
            ka.general().text('Blablablablub');

            test.assert(function () {
                return _this.window.kkView().general().title() == 'Basisdemokratie';
            });
            test.assert(function () {
                return _this.window.kkView().childKas().length == 1;
            });
            test.assert(function () {
                return _this.window.kkView().childKas()[0].general().title() == 'Begriff Basisdemokratie';
            });
            test.assert(function () {
                return _this.window.kkView().childKas()[0].general().text() == 'Blablablablub';
            });
        };

        Tests.prototype.contextImplementation = function () {
            var _this = this;
            this.controller.setContext(new ViewModelContext(null, null, null));

            test.assert(function () {
                return _this.controller['konsenskisteController']['cxt'];
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
