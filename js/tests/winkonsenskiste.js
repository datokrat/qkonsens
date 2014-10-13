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
        Tests.prototype.testKkView = function () {
            var koki = new kokiMdl.Model;
            var window = new win.Win;
            var controller = new ctr.Controller(koki, window, new KokiCommunicator);

            koki.general().title('Title');

            test.assert(function () {
                return window.kkView().general().title() == 'Title';
            });
            test.assert(function () {
                return window.kkView().childKas != null;
            });
        };

        Tests.prototype.testSetKonsenskisteModel = function () {
            var modelOld = new kokiMdl.Model;
            var modelNew = new kokiMdl.Model;
            var window = new win.Win;
            var controller = new ctr.Controller(modelOld, window, new KokiCommunicator);

            var currentTitle = ko.computed(function () {
                return window.kkView().general().title();
            });

            modelOld.general().title('Alt');
            modelNew.general().title('Neu');
            controller.setKonsenskisteModel(modelNew);
            test.assert(function () {
                return currentTitle() == 'Neu';
            });
            modelNew.general().title('Basisdemokratie');
            test.assert(function () {
                return currentTitle() == 'Basisdemokratie';
            });
        };

        Tests.prototype.testNullModel = function () {
            var window = new win.Win;
            var controller = new ctr.Controller(null, window, new KokiCommunicator);
        };

        Tests.prototype.testAComplexUseCase = function () {
            var koki = new kokiMdl.Model;
            var window = new win.Win;
            var controller = new ctr.Controller(koki, window, new KokiCommunicator);

            var ka = new kaMdl.Model();
            koki.childKas.push(ka);

            koki.general().title('Basisdemokratie');
            ka.general().title('Begriff Basisdemokratie');
            ka.general().text('Blablablablub');

            test.assert(function () {
                return window.kkView().general().title() == 'Basisdemokratie';
            });
            test.assert(function () {
                return window.kkView().childKas().length == 1;
            });
            test.assert(function () {
                return window.kkView().childKas()[0].general().title() == 'Begriff Basisdemokratie';
            });
            test.assert(function () {
                return window.kkView().childKas()[0].general().text() == 'Blablablablub';
            });
        };

        Tests.prototype.contextImplementation = function () {
            var koki = new kokiMdl.Model();
            var window = new win.Win();
            var controller = new ctr.Controller(koki, window, new KokiCommunicator);
            controller.setContext(new ViewModelContext(null, null, null));

            test.assert(function () {
                return controller['konsenskisteController']['cxt'];
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
