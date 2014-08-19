define(["require", "exports", 'kernaussageviewmodel', 'kernaussagecontroller', 'childarraysynchronizer'], function(require, exports, kernaussageVm, kernaussageCtr, synchronizer) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            var _this = this;
            this.childKaViewModels = ko.observableArray();
            this.childKaArraySynchronizer = new synchronizer.ChildArraySynchronizer();
            this.model = model;
            this.viewModel = viewModel;

            var sync = this.childKaArraySynchronizer;
            sync.setViewModelFactory(new ViewModelFactory());
            sync.setControllerFactory(new ControllerFactory());
            sync.setViewModelInsertionHandler(function (vm) {
                return _this.insertKaViewModel(vm);
            });
            sync.setViewModelRemovalHandler(function (vm) {
                return _this.removeKaViewModel(vm);
            });

            model.childKaInserted.subscribe(function (args) {
                return _this.onChildKaInserted(args.childKa);
            });
            model.childKaRemoved.subscribe(function (args) {
                return _this.onChildKaRemoved(args.childKa);
            });

            viewModel.childKas = this.childKaViewModels;
        }
        Controller.prototype.getChildKaArray = function () {
            return this.model.getChildKaArray();
        };

        Controller.prototype.onChildKaInserted = function (kaMdl) {
            /*var kaVm = new kernaussageVm.ViewModel();
            var kaCtr = new kernaussageCtr.Controller(kaMdl, kaVm);
            
            this.childKaViewModels.push(kaVm);*/
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
