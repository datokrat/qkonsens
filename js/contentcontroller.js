define(["require", "exports"], function(require, exports) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            this.viewModel = viewModel;
            viewModel.title = function () {
                return model.title();
            };
            viewModel.text = function () {
                return model.text();
            };
        }
        Controller.prototype.dispose = function () {
            this.viewModel.title = null;
            this.viewModel.text = null;
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
