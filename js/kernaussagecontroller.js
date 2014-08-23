define(["require", "exports", 'contentcontroller', 'contentviewmodel'], function(require, exports, Content, ContentViewModel) {
    var Controller = (function () {
        function Controller(model, viewModel) {
            this.init(model, viewModel);
        }
        Controller.prototype.init = function (model, viewModel) {
            viewModel.isActive = ko.observable();
            viewModel.content = ko.observable(new ContentViewModel.WithContext);
            this.viewModel = viewModel;

            this.content = new Content.WithContext(model.content, viewModel.content());
        };

        Controller.prototype.dispose = function () {
            this.content.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
