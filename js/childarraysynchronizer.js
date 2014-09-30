define(["require", "exports"], function(require, exports) {
    var ChildArraySynchronizer = (function () {
        function ChildArraySynchronizer() {
            this.entryKeys = [];
            this.entryValues = [];
            this.modelResolverMap = {};
        }
        ChildArraySynchronizer.prototype.setViewModelFactory = function (fty) {
            this.viewModelFactory = fty;
        };

        ChildArraySynchronizer.prototype.setControllerFactory = function (fty) {
            this.controllerFactory = fty;
        };

        ChildArraySynchronizer.prototype.setViewModelInsertionHandler = function (handler) {
            this.viewModelInsertionHandler = handler || (function (v) {
            });
        };

        ChildArraySynchronizer.prototype.setViewModelRemovalHandler = function (handler) {
            this.viewModelRemovalHandler = handler || (function (v) {
            });
        };

        ChildArraySynchronizer.prototype.inserted = function (m) {
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
