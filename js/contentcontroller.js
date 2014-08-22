define(["require", "exports"], function(require, exports) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            this.init(model, viewModel);
        }
        Controller.prototype.init = function (model, viewModel) {
            this.viewModel = viewModel;
            this.model = model;

            this.viewModel.title = ko.computed(function () {
                return model.title();
            });
            this.viewModel.text = ko.computed(function () {
                return model.text();
            });
        };

        Controller.prototype.dispose = function () {
            this.viewModel.title.dispose();
            this.viewModel.text.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
