define(["require", "exports"], function(require, exports) {
    var ObservingChildArraySynchronizer = (function () {
        function ObservingChildArraySynchronizer() {
            this.modelSubscriptions = [];
            this.innerSync = new ChildArraySynchronizer();
        }
        ObservingChildArraySynchronizer.prototype.setViewModelFactory = function (fty) {
            this.innerSync.setViewModelFactory(fty);
            return this;
        };

        ObservingChildArraySynchronizer.prototype.setControllerFactory = function (fty) {
            this.innerSync.setControllerFactory(fty);
            return this;
        };

        ObservingChildArraySynchronizer.prototype.setModelObservable = function (model) {
            var _this = this;
            this.disposeModel();

            this.modelSubscriptions = [
                model.pushed.subscribe(function (m) {
                    return _this.innerSync.inserted(m);
                }),
                model.removed.subscribe(function (m) {
                    return _this.innerSync.removed(m);
                }),
                model.changed.subscribe(function (old) {
                    return _this.innerSync.setInitialState(model.get());
                })
            ];
            model.changed.raise();
            return this;
        };

        ObservingChildArraySynchronizer.prototype.setViewModelInsertionHandler = function (handler) {
            this.innerSync.setViewModelInsertionHandler(handler);
            return this;
        };

        ObservingChildArraySynchronizer.prototype.setViewModelRemovalHandler = function (handler) {
            this.innerSync.setViewModelRemovalHandler(handler);
            return this;
        };

        ObservingChildArraySynchronizer.prototype.disposeModel = function () {
            this.modelSubscriptions.forEach(function (s) {
                return s.undo();
            });
            this.modelSubscriptions = [];
        };

        ObservingChildArraySynchronizer.prototype.dispose = function () {
            this.disposeModel();
            this.innerSync.dispose();
        };
        return ObservingChildArraySynchronizer;
    })();
    exports.ObservingChildArraySynchronizer = ObservingChildArraySynchronizer;

    var ChildArraySynchronizer = (function () {
        function ChildArraySynchronizer() {
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
            console.log(m);
            if (this.entryKeys.indexOf(m) == -1) {
                var v = this.viewModelFactory.create();
                var c = this.controllerFactory.create(m, v);

                this.entryKeys.push(m);
                this.entryValues.push({ model: m, viewModel: v, controller: c });
                this.viewModelInsertionHandler(v);
            } else
                throw new DuplicateInsertionException();
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
