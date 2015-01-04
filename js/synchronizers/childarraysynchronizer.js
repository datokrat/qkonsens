define(["require", "exports", '../event'], function(require, exports, Events) {
    var PureModelArraySynchronizer = (function () {
        function PureModelArraySynchronizer() {
            var _this = this;
            this.onModelsChanged = function (models) {
                _this.models = models;
                _this.disposeControllers();
                _this.controllers = _this.models.map(function (m) {
                    return _this.controllerFactory.create(m);
                });
            };
            this.modelSubscriptions = [];
            this.models = [];
            this.controllers = [];
        }
        PureModelArraySynchronizer.prototype.setControllerFactory = function (fty) {
            return this;
        };

        PureModelArraySynchronizer.prototype.setModelObservable = function (models) {
            var _this = this;
            this.onModelsChanged(models.get());

            this.disposeModelObservable();
            this.disposeControllers();

            this.modelSubscriptions = [
                models.pushed.subscribe(function (model) {
                    _this.models.push(model);
                    _this.controllers.push(_this.controllerFactory.create(model));
                }),
                models.removed.subscribe(function (model) {
                    var index = _this.models.indexOf(model);
                    _this.models.splice(index, 1);
                    _this.controllers.splice(index, 1).forEach(function (c) {
                        return c.dispose();
                    });
                }),
                models.changed.subscribe(this.onModelsChanged)
            ];
            return this;
        };

        PureModelArraySynchronizer.prototype.disposeModelObservable = function () {
            this.modelSubscriptions.forEach(function (s) {
                return s.dispose();
            });
            this.modelSubscriptions = [];
            this.models = [];
        };

        PureModelArraySynchronizer.prototype.disposeControllers = function () {
            this.controllers.forEach(function (c) {
                return c.dispose();
            });
            this.controllers = [];
        };
        return PureModelArraySynchronizer;
    })();
    exports.PureModelArraySynchronizer = PureModelArraySynchronizer;

    var ObservingChildArraySynchronizer = (function () {
        function ObservingChildArraySynchronizer() {
            this.modelSubscriptions = [];
            this.innerSync = new ChildArraySynchronizer();
            this.itemCreated = this.innerSync.itemCreated;
        }
        ObservingChildArraySynchronizer.prototype.setViewModelFactory = function (fty) {
            this.innerSync.setViewModelFactory(fty);
            return this;
        };

        ObservingChildArraySynchronizer.prototype.setControllerFactory = function (fty) {
            this.innerSync.setControllerFactory(fty);
            return this;
        };

        ObservingChildArraySynchronizer.prototype.setModelObservable = function (models) {
            var _this = this;
            this.models = models;
            this.disposeModelSubscriptions();

            this.modelSubscriptions = [
                models.pushed.subscribe(function (m) {
                    return _this.innerSync.inserted(m);
                }),
                models.removed.subscribe(function (m) {
                    return _this.innerSync.removed(m);
                }),
                models.changed.subscribe(this.initState.bind(this))
            ];
            this.initState();
            return this;
        };

        ObservingChildArraySynchronizer.prototype.setViewModelObservable = function (viewModels) {
            this.viewModels = viewModels;
            this.innerSync.setViewModelInsertionHandler(function (vm) {
                return viewModels.push(vm);
            });
            this.innerSync.setViewModelRemovalHandler(function (vm) {
                return viewModels.remove(vm);
            });
            this.initState();
            return this;
        };

        ObservingChildArraySynchronizer.prototype.initState = function () {
            if (this.models && this.viewModels)
                this.innerSync.setInitialState(this.models.get());
        };

        ObservingChildArraySynchronizer.prototype.disposeModelSubscriptions = function () {
            this.modelSubscriptions.forEach(function (s) {
                return s.dispose();
            });
            this.modelSubscriptions = [];
        };

        ObservingChildArraySynchronizer.prototype.forEachController = function (cb) {
            this.innerSync.forEachController(cb);
        };

        ObservingChildArraySynchronizer.prototype.dispose = function () {
            this.disposeModelSubscriptions();
            this.innerSync.dispose();
        };
        return ObservingChildArraySynchronizer;
    })();
    exports.ObservingChildArraySynchronizer = ObservingChildArraySynchronizer;

    var ChildArraySynchronizer = (function () {
        function ChildArraySynchronizer() {
            this.itemCreated = new Events.EventImpl();
            this.entryKeys = [];
            this.entryValues = [];
            this.modelResolverMap = {};
        }
        ChildArraySynchronizer.prototype.setViewModelFactory = function (fty) {
            this.viewModelFactory = fty;
            return this;
        };

        ChildArraySynchronizer.prototype.setControllerFactory = function (fty) {
            this.controllerFactory = fty;
            return this;
        };

        ChildArraySynchronizer.prototype.setViewModelInsertionHandler = function (handler) {
            this.viewModelInsertionHandler = handler || (function (v) {
            });
            return this;
        };

        ChildArraySynchronizer.prototype.setViewModelRemovalHandler = function (handler) {
            this.viewModelRemovalHandler = handler || (function (v) {
            });
            return this;
        };

        ChildArraySynchronizer.prototype.setInitialState = function (models) {
            this.clear();
            models.forEach(this.inserted.bind(this));
        };

        ChildArraySynchronizer.prototype.inserted = function (m) {
            if (this.entryKeys.indexOf(m) == -1) {
                var v = this.viewModelFactory.create();
                var c = this.controllerFactory.create(m, v);

                this.entryKeys.push(m);
                this.entryValues.push({ model: m, viewModel: v, controller: c });
                this.viewModelInsertionHandler(v);
                this.itemCreated.raise({ model: m, viewModel: v, controller: c });
            } else
                throw new DuplicateInsertionException();
            if (this.entryKeys.length != this.entryValues.length)
                console.error('!!!!!!');
        };

        ChildArraySynchronizer.prototype.removed = function (m) {
            var index = this.entryKeys.indexOf(m);
            var mvc = this.entryValues[index];

            if (mvc) {
                this.viewModelRemovalHandler(mvc.viewModel);

                this.entryKeys.splice(index, 1);
                this.entryValues.splice(index, 1);
                mvc.controller.dispose();
            }
        };

        ChildArraySynchronizer.prototype.clear = function () {
            while (this.entryKeys.length > 0) {
                var key = this.entryKeys[this.entryKeys.length - 1];
                this.removed(key);
            }
        };

        ChildArraySynchronizer.prototype.dispose = function () {
            this.clear();
        };

        ChildArraySynchronizer.prototype.forEachController = function (cb) {
            this.entryValues.forEach(function (value) {
                return cb(value.controller);
            });
        };
        return ChildArraySynchronizer;
    })();
    exports.ChildArraySynchronizer = ChildArraySynchronizer;

    var DuplicateInsertionException = (function () {
        function DuplicateInsertionException() {
        }
        DuplicateInsertionException.prototype.toString = function () {
            return "DuplicateInsertionException";
        };
        return DuplicateInsertionException;
    })();
    exports.DuplicateInsertionException = DuplicateInsertionException;
});
