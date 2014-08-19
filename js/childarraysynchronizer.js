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
            this.viewModelInsertionHandler = handler;
        };

        ChildArraySynchronizer.prototype.setViewModelRemovalHandler = function (handler) {
            this.viewModelRemovalHandler = handler;
        };

        ChildArraySynchronizer.prototype.inserted = function (m) {
            var v = this.viewModelFactory.create();
            var c = this.controllerFactory.create(m, v);

            this.modelResolverMap[m] = { model: m, viewModel: v, controller: c };
            this.viewModelInsertionHandler(v);
        };

        ChildArraySynchronizer.prototype.removed = function (m) {
            var mvc = this.modelResolverMap[m];

            //TODO: remove mvc
            this.viewModelRemovalHandler(mvc.viewModel);
        };
        return ChildArraySynchronizer;
    })();
    exports.ChildArraySynchronizer = ChildArraySynchronizer;
});
