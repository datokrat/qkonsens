define(["require", "exports", 'synchronizers/ksynchronizers', 'contentmodel', 'rating', 'command'], function(require, exports, KSync, ContentModel, Rating, Commands) {
    var Model = (function () {
        function Model() {
            this.content = ko.observable(new ContentModel.General);
            this.rating = ko.observable(new Rating.LikeRatingModel);
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
            this.model = model;
            this.communicator = communicator;
            this.commandProcessor = new Commands.CommandProcessor();
            this.initCommandProcessor();

            viewModel.content = ko.observable();
            viewModel.removeClick = function () {
                _this.commentableModel && _this.commentableModel.removeComment(model);
            };

            this.contentSynchronizer = new KSync.GeneralContentSynchronizer(communicator.content).setViewModelObservable(viewModel.content).setModelObservable(model.content);

            viewModel.rating = ko.observable();
            this.ratingSynchronizer = new KSync.LikeRatingSynchronizer(this.commandProcessor);
            this.ratingSynchronizer.setViewModelObservable(viewModel.rating).setModelObservable(model.rating);
        }
        Controller.prototype.initCommandProcessor = function () {
            var _this = this;
            this.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof Rating.SelectLikeRatingCommand) {
                    var typedCmd = cmd;
                    _this.communicator.rating.submitLikeRating(_this.model.id, typedCmd.ratingValue, function () {
                    });
                    return true;
                }
                return false;
            });
        };

        Controller.prototype.setCommentableModel = function (commentableModel) {
            this.commentableModel = commentableModel;
        };

        Controller.prototype.dispose = function () {
            this.contentSynchronizer.dispose();
            this.ratingSynchronizer.dispose();
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
