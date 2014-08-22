define(["require", "exports", 'contentcontroller'], function(require, exports, Content) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            this.init(model, viewModel);
        }
        Controller.prototype.init = function (model, viewModel) {
            viewModel.isActive = ko.observable();
            this.viewModel = viewModel;

            this.content = new Content.Controller(model.content, viewModel.content);
        };

        Controller.prototype.dispose = function () {
            this.content.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
