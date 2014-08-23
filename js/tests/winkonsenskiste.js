var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../konsenskistemodel', 'windows/konsenskiste', 'windows/konsenskistecontroller', '../kernaussagemodel'], function(require, exports, unit, test, kokiMdl, win, ctr, kaMdl) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.testKkView = function () {
            var koki = new kokiMdl.Model;
            var window = new win.Win;
            var controller = new ctr.Controller(koki, window);

            koki.content.title('Title');

            test.assert(function () {
                return window.kkView().content().title() == 'Title';
            });
            test.assert(function () {
                return window.kkView().childKas != null;
            });
        };

        Tests.prototype.testSetKonsenskisteModel = function () {
            var modelOld = new kokiMdl.Model;
            var modelNew = new kokiMdl.Model;
            var window = new win.Win;
            var controller = new ctr.Controller(modelOld, window);

            var currentTitle = ko.computed(function () {
                return window.kkView().content().title();
            });

            modelOld.content.title('Alt');
            modelNew.content.title('Neu');
            controller.setKonsenskisteModel(modelNew);
            test.assert(function () {
                return currentTitle() == 'Neu';
            });
            modelNew.content.title('Basisdemokratie');
            test.assert(function () {
                return currentTitle() == 'Basisdemokratie';
            });
        };

        Tests.prototype.testNullModel = function () {
            var window = new win.Win;
            var controller = new ctr.Controller(null, window);
        };

        Tests.prototype.testAComplexUseCase = function () {
            var koki = new kokiMdl.Model;
            var window = new win.Win;
            var controller = new ctr.Controller(koki, window);

            var ka = new kaMdl.Model();
            koki.appendKa(ka);

            koki.content.title('Basisdemokratie');
            ka.content.title('Begriff Basisdemokratie');
            ka.content.text('Blablablablub');

            test.assert(function () {
                return window.kkView().content().title() == 'Basisdemokratie';
            });
            test.assert(function () {
                return window.kkView().childKas().length == 1;
            });
            test.assert(function () {
                return window.kkView().childKas()[0].content().title() == 'Begriff Basisdemokratie';
            });
            test.assert(function () {
                return window.kkView().childKas()[0].content().text() == 'Blablablablub';
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
