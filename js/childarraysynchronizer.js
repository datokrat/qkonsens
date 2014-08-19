define(["require", "exports"], function(require, exports) {
    var ChildArraySynchronizer = (function () {
        function ChildArraySynchronizer() {
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
            if (!this.modelResolverMap[m]) {
                var v = this.viewModelFactory.create();
                var c = this.controllerFactory.create(m, v);

                this.modelResolverMap[m] = { model: m, viewModel: v, controller: c };
                this.viewModelInsertionHandler(v);
            } else
                throw new DuplicateInsertionException();
        };

        ChildArraySynchronizer.prototype.removed = function (m) {
            var mvc = this.modelResolverMap[m];
            this.modelResolverMap[m];

            if (mvc) {
                this.viewModelRemovalHandler(mvc.viewModel);

                delete this.modelResolverMap[m];
                mvc.controller.dispose();
            }
        };
        return ChildArraySynchronizer;
    })();
    exports.ChildArraySynchronizer = ChildArraySynchronizer;

    var DuplicateInsertionException = (function () {
        function DuplicateInsertionException() {
        }
        return DuplicateInsertionException;
    })();
    exports.DuplicateInsertionException = DuplicateInsertionException;
});
