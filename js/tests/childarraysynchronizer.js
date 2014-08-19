var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/tsunit', 'tests/test', '../childarraysynchronizer'], function(require, exports, unit, test, synchronizer) {
    var Tests = (function (_super) {
        __extends(Tests, _super);
        function Tests() {
            _super.apply(this, arguments);
            this.synchronizerFactory = new SynchronizerFactory();
        }
        Tests.prototype.test = function () {
            var sync = this.synchronizerFactory.create();
            var model = new Model();
            var insertionCtr = 0;
            var removalCtr = 0;

            sync.setViewModelInsertionHandler(function (viewModel) {
                test.assert(function () {
                    return viewModel.mdl == model;
                });
                insertionCtr++;
            });
            sync.setViewModelRemovalHandler(function (viewModel) {
                test.assert(function () {
                    return viewModel.mdl == model;
                });
                removalCtr++;
            });

            sync.inserted(model);
            test.assert(function () {
                return insertionCtr == 1 && removalCtr == 0;
            });
            sync.removed(model);
            test.assert(function () {
                return insertionCtr == 1 && removalCtr == 1;
            });
        };

        Tests.prototype.testRemovalOfNonExistentModel = function () {
            var sync = this.synchronizerFactory.create();
            sync.setViewModelInsertionHandler(function (viewModel) {
                return test.assert(function () {
                    return !"inserted";
                });
            });
            sync.setViewModelRemovalHandler(function (viewModel) {
                return test.assert(function () {
                    return !"removed";
                });
            });

            var model = new Model();
            sync.removed(model);

            test.assert(function () {
                return model.vm == null;
            });
        };

        Tests.prototype.testDoubleRegistering = function () {
            var sync = this.synchronizerFactory.create();
            sync.setViewModelInsertionHandler(function () {
            });
            sync.setViewModelRemovalHandler(function () {
            });
            var model = new Model();

            test.assertThrows(function () {
                sync.inserted(model);
                sync.inserted(model);
            });
        };

        Tests.prototype.testWithoutHandlers = function () {
            var sync = this.synchronizerFactory.create();
            sync.setViewModelInsertionHandler(null);
            sync.setViewModelRemovalHandler(null);
            var model = new Model();

            sync.inserted(model);
            sync.removed(model);
        };
        return Tests;
    })(unit.TestClass);
    exports.Tests = Tests;

    var SynchronizerFactory = (function () {
        function SynchronizerFactory() {
        }
        SynchronizerFactory.prototype.create = function () {
            var sync = new synchronizer.ChildArraySynchronizer();
            var insertionCtr = 0;
            var removalCtr = 0;

            sync.setViewModelFactory({ create: function () {
                    return new ViewModel();
                } });
            sync.setControllerFactory({ create: function (model, viewModel) {
                    return new Controller(model, viewModel);
                } });

            return sync;
        };
        return SynchronizerFactory;
    })();

    var Model = (function () {
        function Model() {
        }
        return Model;
    })();

    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();

    var Controller = (function () {
        function Controller(model, viewModel) {
            this.args = arguments;
            model.vm = viewModel;
            viewModel.mdl = model;
        }
        Controller.prototype.dispose = function () {
            this.args[0].vm = null;
            this.args[1].mdl = null;
        };
        return Controller;
    })();
});
