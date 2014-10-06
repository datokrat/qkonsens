define(["require", "exports", 'synchronizers/ksynchronizers', 'contentmodel'], function(require, exports, KSync, ContentModel) {
    var Model = (function () {
        function Model() {
            this.content = ko.observable(new ContentModel.General);
        }
        return Model;
    })();
    exports.Model = Model;

    var idCtr = 0;
    var ViewModel = (function () {
        function ViewModel() {
            this.id = idCtr++;
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;

    var Controller = (function () {
        function Controller(model, viewModel, communicator) {
            viewModel.content = ko.observable();

            this.contentSynchronizer = new KSync.GeneralContentSynchronizer(communicator).setViewModelChangedHandler(function (content) {
                return viewModel.content(content);
            }).setModelObservable(model.content);
        }
        Controller.prototype.dispose = function () {
            this.contentSynchronizer.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
