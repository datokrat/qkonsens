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
            var _this = this;
            viewModel.content = ko.observable();
            viewModel.removeClick = function () {
                _this.commentableModel && _this.commentableModel.removeComment(model);
            };

            this.contentSynchronizer = new KSync.GeneralContentSynchronizer(communicator).setViewModelChangedHandler(function (content) {
                return viewModel.content(content);
            }).setModelObservable(model.content);
        }
        Controller.prototype.setCommentableModel = function (commentableModel) {
            this.commentableModel = commentableModel;
        };

        Controller.prototype.dispose = function () {
            this.contentSynchronizer.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
