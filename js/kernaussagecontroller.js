define(["require", "exports"], function(require, exports) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            viewModel.title = function () {
                return model.title();
            };
            viewModel.isActive = ko.observable();
        }
        return Controller;
    })();
    exports.Controller = Controller;
});
