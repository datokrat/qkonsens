var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'event', 'factories/constructorbased', 'kernaussageviewmodel', 'kernaussagecontroller', 'contentviewmodel', 'contentcontroller', 'rating', 'contentviewmodel', 'contentcontroller', 'childarraysynchronizer', 'childsynchronizer'], function(require, exports, evt, ConstructorBasedFactory, kernaussageVm, kernaussageCtr, ContentViewModel, ContentController, Rating, contentVm, content, arraySynchronizer, synchronizer) {
    var ControllerImpl = (function () {
        function ControllerImpl(model, viewModel, communicator) {
            var _this = this;
            this.onContextChanged = function () {
                _this.context.dispose();
                _this.context = new content.Context(_this.model.context(), _this.viewModel.context());
            };
            this.onKokiRetrieved = function (args) {
                if (_this.model.id == args.konsenskiste.id)
                    _this.model.set(args.konsenskiste);
            };
            //private rating: Rating.Controller;
            this.childKaViewModels = ko.observableArray();
            this.childKaArraySynchronizer = new arraySynchronizer.ChildArraySynchronizer();
            this.generalContentSynchronizer = new GeneralContentSynchronizer();
            this.ratingSynchronizer = new RatingSynchronizer();
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

            this.generalContentSynchronizer.setViewModelFactory(new ConstructorBasedFactory.Factory(ContentViewModel.General)).setControllerFactory(new ConstructorBasedFactory.ControllerFactoryEx(ContentController.General, communicator.content)).setViewModelChangedHandler(function (value) {
                return _this.viewModel.general(value);
            }).setModelObservable(this.model.general);

            this.ratingSynchronizer.setViewModelFactory(new ConstructorBasedFactory.Factory(Rating.ViewModel)).setControllerFactory(new ConstructorBasedFactory.ControllerFactory(Rating.Controller)).setViewModelChangedHandler(function (value) {
                return _this.viewModel.rating(value);
            }).setModelObservable(this.model.rating);

            this.context = new content.Context(this.model.context(), this.viewModel.context());
            //this.rating = new Rating.Controller(model.rating(), viewModel.rating());
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
                }),
                evt.Subscription.fromDisposable(this.model.context.subscribe(function () {
                    return _this.onContextChanged();
                }))
            ];
        };

        ControllerImpl.prototype.initViewModel = function () {
            this.viewModel.general = ko.observable(new contentVm.General);
            this.viewModel.context = ko.observable(new contentVm.Context);
            this.viewModel.rating = ko.observable(new Rating.ViewModel);

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
            this.ratingSynchronizer.dispose();
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

    var GeneralContentSynchronizer = (function (_super) {
        __extends(GeneralContentSynchronizer, _super);
        function GeneralContentSynchronizer() {
            _super.apply(this, arguments);
        }
        return GeneralContentSynchronizer;
    })(synchronizer.ChildSynchronizer);

    var GeneralContentControllerFactory = (function (_super) {
        __extends(GeneralContentControllerFactory, _super);
        function GeneralContentControllerFactory() {
            _super.apply(this, arguments);
        }
        return GeneralContentControllerFactory;
    })(ConstructorBasedFactory.ControllerFactoryEx);

    var RatingSynchronizer = (function (_super) {
        __extends(RatingSynchronizer, _super);
        function RatingSynchronizer() {
            _super.apply(this, arguments);
        }
        return RatingSynchronizer;
    })(synchronizer.ChildSynchronizer);

    var RatingControllerFactory = (function (_super) {
        __extends(RatingControllerFactory, _super);
        function RatingControllerFactory() {
            _super.apply(this, arguments);
        }
        return RatingControllerFactory;
    })(ConstructorBasedFactory.ControllerFactory);

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
