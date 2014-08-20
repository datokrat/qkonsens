define(["require", "exports", 'kernaussageviewmodel', 'kernaussagecontroller', 'contentcontroller', 'childarraysynchronizer'], function(require, exports, kernaussageVm, kernaussageCtr, content, synchronizer) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            this.childKaViewModels = ko.observableArray();
            this.childKaArraySynchronizer = new synchronizer.ChildArraySynchronizer();
            this.model = model;
            this.viewModel = viewModel;

            this.content = new content.Controller(model.content, viewModel.content);

            this.initChildKaSynchronizer();
            this.initModelEvents();
            this.initViewModel();
        }
        Controller.prototype.initChildKaSynchronizer = function () {
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

        Controller.prototype.initModelEvents = function () {
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

        Controller.prototype.initViewModel = function () {
            this.viewModel.childKas = this.childKaViewModels;
        };

        Controller.prototype.getChildKaArray = function () {
            return this.model.getChildKaArray();
        };

        Controller.prototype.onChildKaInserted = function (kaMdl) {
            this.childKaArraySynchronizer.inserted(kaMdl);
        };

        Controller.prototype.onChildKaRemoved = function (kaMdl) {
            this.childKaArraySynchronizer.removed(kaMdl);
        };

        Controller.prototype.insertKaViewModel = function (vm) {
            this.childKaViewModels.push(vm);
        };

        Controller.prototype.removeKaViewModel = function (vm) {
            this.childKaViewModels.remove(vm);
        };

        Controller.prototype.dispose = function () {
            this.content.dispose();
            this.modelSubscriptions.forEach(function (s) {
                return s.undo();
            });

            this.viewModel.childKas = null;
        };
        return Controller;
    })();
    exports.Controller = Controller;

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
});
