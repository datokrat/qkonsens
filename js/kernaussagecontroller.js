define(["require", "exports", 'contentcontroller', 'contentviewmodel'], function(require, exports, ContentController, ContentViewModel) {
    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            this.init(model, viewModel, communicator);
        }
        Controller.prototype.init = function (model, viewModel, communicator) {
            viewModel.isActive = ko.observable();
            viewModel.general = ko.observable(new ContentViewModel.General);
            viewModel.context = ko.observable(new ContentViewModel.Context);
            this.viewModel = viewModel;

            this.generalContent = new ContentController.General(model.general(), viewModel.general(), communicator);
            this.context = new ContentController.Context(model.context(), viewModel.context());
        };

        Controller.prototype.dispose = function () {
            this.generalContent.dispose();
            this.context.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
