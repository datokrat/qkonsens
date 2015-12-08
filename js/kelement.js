define(["require", "exports", 'contentmodel', 'rating', 'discussion', 'environs', 'command', 'kelementcommands', 'synchronizers/ksynchronizers'], function (require, exports, ContentModel, Rating, Discussion, Environs, Commands, KElementCommands, KSync) {
    var Model = (function () {
        function Model() {
            this.id = ko.observable();
            this.general = ko.observable(new ContentModel.General);
            this.context = ko.observable(new ContentModel.Context);
            this.rating = ko.observable(new Rating.Model);
            this.discussion = ko.observable(new Discussion.Model);
            this.environs = ko.observable(new Environs.Model);
        }
        Model.prototype.set = function (model) {
            this.id(model.id());
            this.general().set(model.general());
            this.context().set(model.context());
            this.rating().set(model.rating());
            this.discussion(model.discussion());
        };
        return Model;
    })();
    exports.Model = Model;
    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
    var Controller = (function () {
        function Controller(model, viewModel, communicator, parentCommandProcessor) {
            var _this = this;
            this.parentCommandProcessor = parentCommandProcessor;
            this.commandProcessor = new Commands.CommandProcessor();
            this.initCommandProcessor();
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;
            this.initDiscussion();
            this.initEnvirons();
            this.initGeneralContent();
            this.initContext();
            this.initRating();
            viewModel.editClick = function () {
                parentCommandProcessor.processCommand(new KElementCommands.OpenEditKElementWindowCommand(_this.model));
            };
        }
        Controller.prototype.initCommandProcessor = function () {
            var _this = this;
            this.commandProcessor.chain.append(function (cmd) {
                if (cmd instanceof Rating.SelectRatingCommand) {
                    var castCmd = cmd;
                    _this.communicator.rating.submitRating(_this.model.id(), castCmd.ratingValue, castCmd.then);
                    return true;
                }
                return false;
            });
        };
        Controller.prototype.dispose = function () {
            this.generalContentSynchronizer.dispose();
            this.contextSynchronizer.dispose();
            this.ratingSynchronizer.dispose();
            this.discussionSynchronizer.dispose();
            this.environsSynchronizer.dispose();
        };
        Controller.prototype.initDiscussion = function () {
            this.viewModel.discussion = ko.observable();
            this.discussionSynchronizer = new KSync.DiscussionSynchronizer({ communicator: this.communicator.discussion, commandProcessor: this.parentCommandProcessor });
            this.discussionSynchronizer
                .setDiscussableModel(this.model)
                .setDiscussableViewModel(this.viewModel)
                .setViewModelObservable(this.viewModel.discussion)
                .setModelObservable(this.model.discussion);
        };
        Controller.prototype.initEnvirons = function () {
            this.model.environs().parentID = this.model.id();
            this.viewModel.environs = ko.observable();
            this.environsSynchronizer = new KSync.EnvironsSynchronizer({ commandProcessor: this.parentCommandProcessor })
                .setViewModelObservable(this.viewModel.environs)
                .setModelObservable(this.model.environs);
        };
        Controller.prototype.initGeneralContent = function () {
            var _this = this;
            this.viewModel.general = ko.observable();
            this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(this.communicator.content)
                .setViewModelChangedHandler(function (value) { return _this.viewModel.general(value); })
                .setModelObservable(this.model.general);
        };
        Controller.prototype.initContext = function () {
            var _this = this;
            this.viewModel.context = ko.observable();
            this.contextSynchronizer = new KSync.ContextSynchronizer(this.communicator.content)
                .setViewModelChangedHandler(function (value) { return _this.viewModel.context(value); })
                .setModelObservable(this.model.context);
        };
        Controller.prototype.initRating = function () {
            var _this = this;
            this.viewModel.rating = ko.observable();
            this.ratingSynchronizer = new KSync.RatingSynchronizer({ communicator: this.communicator.rating, commandProcessor: this.commandProcessor });
            this.ratingSynchronizer
                .setRatableModel(this.model);
            this.ratingSynchronizer
                .setViewModelChangedHandler(function (value) { return _this.viewModel.rating(value); })
                .setModelObservable(this.model.rating);
        };
        Controller.prototype.setViewModelContext = function (cxt) {
            this.cxt = cxt;
            this.discussionSynchronizer.setViewModelContext(cxt);
            return this;
        };
        return Controller;
    })();
    exports.Controller = Controller;
});
