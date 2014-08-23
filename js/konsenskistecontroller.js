define(["require", "exports", 'kernaussageviewmodel', 'kernaussagecontroller', 'contentviewmodel', 'contentcontroller', 'childarraysynchronizer'], function(require, exports, kernaussageVm, kernaussageCtr, contentVm, content, synchronizer) {
    var ControllerImpl = (function () {
        function ControllerImpl(model, viewModel) {
            this.childKaViewModels = ko.observableArray();
            this.childKaArraySynchronizer = new synchronizer.ChildArraySynchronizer();
            this.init(model, viewModel);
        }
        ControllerImpl.prototype.init = function (model, viewModel) {
            this.model = model;
            this.viewModel = viewModel;

            this.initChildKaSynchronizer();
            this.initModelEvents();
            this.initViewModel();

            this.content = new content.WithContext(this.model.content, this.viewModel.content());
        };

        ControllerImpl.prototype.initChildKaSynchronizer = function () {
            var _this = this;
            var sync = this.childKaArraySynchronizer;

            sync.setViewModelFactory(new ViewModelFactory());
            sync.setControllerFactory(new ControllerFactory());
            sync.setViewModelInsertionHandler(function (vm) {
                return _this.insertKaViewModel(vm);
            });
            sync.setViewModelRemovalHandler(function (vm) {
                return _this.removeKaViewModel(vm);
            });
        };

        ControllerImpl.prototype.initModelEvents = function () {
            var _this = this;
            this.modelSubscriptions = [
                this.model.childKaInserted.subscribe(function (args) {
                    return _this.onChildKaInserted(args.childKa);
                }),
                this.model.childKaRemoved.subscribe(function (args) {
                    return _this.onChildKaRemoved(args.childKa);
                })
            ];
        };

        ControllerImpl.prototype.initViewModel = function () {
            this.viewModel.content = ko.observable(new contentVm.WithContext);
            this.viewModel.childKas = this.childKaViewModels;
        };

        ControllerImpl.prototype.getChildKaArray = function () {
            return this.model.getChildKaArray();
        };

        ControllerImpl.prototype.onChildKaInserted = function (kaMdl) {
            this.childKaArraySynchronizer.inserted(kaMdl);
        };

        ControllerImpl.prototype.onChildKaRemoved = function (kaMdl) {
            this.childKaArraySynchronizer.removed(kaMdl);
        };

        ControllerImpl.prototype.insertKaViewModel = function (vm) {
            this.childKaViewModels.push(vm);
        };

        ControllerImpl.prototype.removeKaViewModel = function (vm) {
            this.childKaViewModels.remove(vm);
        };

        ControllerImpl.prototype.dispose = function () {
            this.content.dispose();
            this.modelSubscriptions.forEach(function (s) {
                return s.undo();
            });
        };
        return ControllerImpl;
    })();
    exports.ControllerImpl = ControllerImpl;

    var ViewModelFactory = (function () {
        function ViewModelFactory() {
        }
        ViewModelFactory.prototype.create = function () {
            return new kernaussageVm.ViewModel();
        };
        return ViewModelFactory;
    })();

    var ControllerFactory = (function () {
        function ControllerFactory() {
        }
        ControllerFactory.prototype.create = function (model, viewModel) {
            return new kernaussageCtr.Controller(model, viewModel);
        };
        return ControllerFactory;
    })();

    var NullController = (function () {
        function NullController(viewModel) {
        }
        NullController.prototype.dispose = function () {
        };
        return NullController;
    })();
    exports.NullController = NullController;
});
