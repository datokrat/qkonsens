define(["require", "exports", 'contentcontroller', 'contentviewmodel'], function(require, exports, Content, ContentViewModel) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            this.init(model, viewModel, communicator);
        }
        Controller.prototype.init = function (model, viewModel, communicator) {
            viewModel.isActive = ko.observable();
            viewModel.content = ko.observable(new ContentViewModel.WithContext);
            this.viewModel = viewModel;

            this.content = new Content.WithContext(model.content, viewModel.content(), communicator);
        };

        Controller.prototype.dispose = function () {
            this.content.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
