define(["require", "exports"], function(require, exports) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            viewModel.title = function () {
                return model.title();
            };
            viewModel.isActive = ko.observable();

            this.viewModel = viewModel;
        }
        Controller.prototype.dispose = function () {
            this.viewModel.isActive = null;
            this.viewModel.title = null;
            this.viewModel = null;
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
