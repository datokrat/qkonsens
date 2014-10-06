define(["require", "exports", 'synchronizers/ksynchronizers', 'synchronizers/kokisynchronizers', 'synchronizers/comment'], function(require, exports, KSync, KokiSync, CommentSynchronizer) {
    var ControllerImpl = (function () {
        function ControllerImpl(model, viewModel, communicator) {
            var _this = this;
            this.onKokiReceived = function (args) {
                if (_this.model.id == args.konsenskiste.id)
                    _this.model.set(args.konsenskiste);
            };
            this.onCommentsReceived = function (args) {
                if (_this.model.id == args.id)
                    _this.model.comments.set(args.comments);
            };
            this.modelSubscriptions = [];
            this.communicatorSubscriptions = [];
            this.init(model, viewModel, communicator);
        }
        ControllerImpl.prototype.init = function (model, viewModel, communicator) {
            this.model = model;
            this.viewModel = viewModel;
            this.communicator = communicator;

            this.initCommunicator();
            this.initViewModel();

            this.initKas();
            this.initComments();
            this.initGeneralContent();
            this.initContext();
            this.initRating();
        };

        ControllerImpl.prototype.setContext = function (cxt) {
            this.cxt = cxt;
            return this;
        };

        ControllerImpl.prototype.initViewModel = function () {
            var _this = this;
            this.viewModel.discussionClick = function () {
                if (_this.cxt) {
                    _this.communicator.queryCommentsOf(_this.model.id);
                    _this.cxt.discussionWindow.discussable(_this.viewModel);
                    _this.cxt.setLeftWindow(_this.cxt.discussionWindow);
                }
            };
        };

        ControllerImpl.prototype.initKas = function () {
            this.viewModel.childKas = ko.observableArray();

            this.kaSynchronizer = new KokiSync.KaSynchronizer(this.communicator.kernaussage).setViewModelObservable(this.viewModel.childKas).setModelObservable(this.model.childKas);
        };

        ControllerImpl.prototype.initComments = function () {
            this.viewModel.comments = ko.observableArray();

            this.commentSynchronizer = new CommentSynchronizer(this.communicator.content).setViewModelObservable(this.viewModel.comments).setModelObservable(this.model.comments);
        };

        ControllerImpl.prototype.initGeneralContent = function () {
            var _this = this;
            this.viewModel.general = ko.observable();

            this.generalContentSynchronizer = new KSync.GeneralContentSynchronizer(this.communicator.content).setViewModelChangedHandler(function (value) {
                return _this.viewModel.general(value);
            }).setModelObservable(this.model.general);
        };

        ControllerImpl.prototype.initContext = function () {
            var _this = this;
            this.viewModel.context = ko.observable();

            this.contextSynchronizer = new KSync.ContextSynchronizer(this.communicator.content).setViewModelChangedHandler(function (value) {
                return _this.viewModel.context(value);
            }).setModelObservable(this.model.context);
        };

        ControllerImpl.prototype.initRating = function () {
            var _this = this;
            this.viewModel.rating = ko.observable();

            this.ratingSynchronizer = new KSync.RatingSynchronizer().setViewModelChangedHandler(function (value) {
                return _this.viewModel.rating(value);
            }).setModelObservable(this.model.rating);
        };

        ControllerImpl.prototype.initCommunicator = function () {
            this.communicatorSubscriptions = ([
                this.communicator.received.subscribe(this.onKokiReceived),
                this.communicator.commentsReceived.subscribe(this.onCommentsReceived)
            ]);
        };

        ControllerImpl.prototype.dispose = function () {
            this.generalContentSynchronizer.dispose();
            this.contextSynchronizer.dispose();
            this.ratingSynchronizer.dispose();
            this.commentSynchronizer.dispose();

            this.modelSubscriptions.forEach(function (s) {
                return s.undo();
            });
            this.communicatorSubscriptions.forEach(function (s) {
                return s.undo();
            });
        };
        return ControllerImpl;
    })();
    exports.ControllerImpl = ControllerImpl;
});
