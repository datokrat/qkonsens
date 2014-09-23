define(["require", "exports", 'kernaussageviewmodel', 'kernaussagecontroller', 'contentviewmodel', 'contentcontroller', 'childarraysynchronizer'], function(require, exports, kernaussageVm, kernaussageCtr, contentVm, content, synchronizer) {
    var ControllerImpl = (function () {
        function ControllerImpl(model, viewModel, communicator) {
            var _this = this;
            this.onKokiRetrieved = function (args) {
                if (_this.model.id == args.konsenskiste.id)
                    _this.model.set(args.konsenskiste);
            };
            this.childKaViewModels = ko.observableArray();
            this.childKaArraySynchronizer = new synchronizer.ChildArraySynchronizer();
            this.init(model, viewModel, communicator);
        }
        ControllerImpl.prototype.init = function (model, viewModel, communicator) {
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;

            this.initChildKaSynchronizer();
            this.initModelEvents();
            this.initViewModel();
            this.initCommunicator();

            this.generalContent = new content.General(this.model.general(), this.viewModel.general(), communicator.content);
            this.context = new content.Context(this.model.context(), this.viewModel.context());
        };

        ControllerImpl.prototype.initChildKaSynchronizer = function () {
            var _this = this;
            var sync = this.childKaArraySynchronizer;

            sync.setViewModelFactory(new ViewModelFactory());
            sync.setControllerFactory(new ControllerFactory(this.communicator.content));
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
            this.viewModel.general = ko.observable(new contentVm.General);
            this.viewModel.context = ko.observable(new contentVm.Context);
            this.viewModel.childKas = this.childKaViewModels;
        };

        ControllerImpl.prototype.initCommunicator = function () {
            var _this = this;
            this.communicatorSubscriptions = ([
                this.communicator.content.generalContentRetrieved.subscribe(function (args) {
                    if (args.general.id == _this.model.general().id)
                        _this.model.general().set(args.general);
                }),
                this.communicator.content.contextRetrieved.subscribe(function (args) {
                    if (args.context.id == _this.model.context().id)
                        _this.model.context().set(args.context);
                }),
                this.communicator.received.subscribe(this.onKokiRetrieved)
            ]);
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
            this.generalContent.dispose();
            this.context.dispose();

            this.modelSubscriptions.forEach(function (s) {
                return s.undo();
            });
            this.communicatorSubscriptions.forEach(function (s) {
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
        function ControllerFactory(communicator) {
            this.communicator = communicator;
        }
        ControllerFactory.prototype.create = function (model, viewModel) {
            return new kernaussageCtr.Controller(model, viewModel, this.communicator);
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
