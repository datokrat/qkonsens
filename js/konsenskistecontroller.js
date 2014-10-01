define(["require", "exports", 'kernaussageviewmodel', 'kernaussagecontroller', 'synchronizers/childarraysynchronizer', 'synchronizers/ksynchronizers'], function(require, exports, kernaussageVm, kernaussageCtr, arraySynchronizer, KSync) {
    var ControllerImpl = (function () {
        function ControllerImpl(model, viewModel, communicator) {
            var _this = this;
            this.onKokiRetrieved = function (args) {
                if (_this.model.id == args.konsenskiste.id)
                    _this.model.set(args.konsenskiste);
            };
            this.childKaViewModels = ko.observableArray();
            this.childKaArraySynchronizer = new arraySynchronizer.ChildArraySynchronizer();
            this.init(model, viewModel, communicator);
        }
        ControllerImpl.prototype.init = function (model, viewModel, communicator) {
            var _this = this;
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;

            this.initChildKaSynchronizer();
            this.initModelEvents();
            this.initViewModel();
            this.initCommunicator();

            this.initKas();

            this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(communicator.content).setViewModelChangedHandler(function (value) {
                return _this.viewModel.general(value);
            }).setModelObservable(this.model.general);

            this.contextSynchronizer = new KSync.ContextSynchronizer().setViewModelChangedHandler(function (value) {
                return _this.viewModel.context(value);
            }).setModelObservable(this.model.context);

            this.ratingSynchronizer = new KSync.RatingSynchronizer().setViewModelChangedHandler(function (value) {
                return _this.viewModel.rating(value);
            }).setModelObservable(this.model.rating);
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
            this.viewModel.general = ko.observable();
            this.viewModel.context = ko.observable();
            this.viewModel.rating = ko.observable();

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

        ControllerImpl.prototype.initKas = function () {
            this.model.childKas().forEach(this.onChildKaInserted.bind(this));
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
            this.generalContentSynchronizer.dispose();
            this.contextSynchronizer.dispose();
            this.ratingSynchronizer.dispose();

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
