var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../common', '../command', '../kokilogic', '../konsenskistemodel', 'windows/konsenskiste', 'windows/konsenskistecontroller', 'tests/testkonsenskistecommunicator', '../kernaussagemodel'], function(require, exports, unit, test, Common, Commands, KokiLogic, KonsenskisteModel, win, ctr, KokiCommunicator, kaMdl) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
        }
        Tests.prototype.setUp = function () {
            this.konsenskisteModel = new KonsenskisteModel.Model();
            this.window = new win.Win();
            this.commandProcessor = new Commands.CommandProcessor();
            this.controller = new ctr.ControllerImpl(this.konsenskisteModel, this.window, { communicator: new KokiCommunicator.Main, commandProcessor: this.commandProcessor });
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
            var newModel = new KonsenskisteModel.Model;

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
                var controller = new ctr.ControllerImpl(null, window, { communicator: new KokiCommunicator.Main, commandProcessor: this.commandProcessor });
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

        Tests.prototype.emitHandleChangedKokiStateCommand = function () {
            var counter = new Common.Counter();
            this.commandProcessor.chain.append(function (cmd) {
                counter.inc('cmd');
                test.assert(function (v) {
                    return cmd instanceof KokiLogic.HandleChangedKokiWinStateCommand;
                });
                return true;
            });

            var kokiModel = new KonsenskisteModel.Model();
            kokiModel.id(3);
            this.controller.setKonsenskisteModel(kokiModel);

            test.assert(function (v) {
                return v.val(counter.get('cmd')) == 1;
            });
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;
});
