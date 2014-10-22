define(["require", "exports", 'synchronizers/ksynchronizers', 'synchronizers/kokisynchronizers'], function(require, exports, KSync, KokiSync) {
    var ControllerImpl = (function () {
        function ControllerImpl(model, viewModel, communicator) {
            var _this = this;
            this.onKokiReceived = function (args) {
                if (_this.model.id() == args.konsenskiste.id())
                    _this.model.set(args.konsenskiste);
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

            this.initKas();
            this.initDiscussion();
            this.initGeneralContent();
            this.initContext();
            this.initRating();
        };

        ControllerImpl.prototype.setContext = function (cxt) {
            this.cxt = cxt;
            this.discussionSynchronizer.setViewModelContext(cxt);
            this.kaSynchronizer.setViewModelContext(cxt);
            return this;
        };

        ControllerImpl.prototype.initKas = function () {
            var _this = this;
            this.viewModel.childKas = ko.observableArray();
            this.viewModel.newKaFormVisible = ko.observable(false);
            this.viewModel.newKaClick = function () {
                var oldValue = _this.viewModel.newKaFormVisible();
                _this.viewModel.newKaFormVisible(!oldValue);
            };

            this.kaSynchronizer = new KokiSync.KaSynchronizer(this.communicator.kernaussage);
            this.kaSynchronizer.setViewModelObservable(this.viewModel.childKas).setModelObservable(this.model.childKas);
        };

        ControllerImpl.prototype.initDiscussion = function () {
            this.viewModel.discussion = ko.observable();
            this.discussionSynchronizer = new KSync.DiscussionSynchronizer(this.communicator.discussion);
            this.discussionSynchronizer.setDiscussableModel(this.model).setDiscussableViewModel(this.viewModel).setViewModelObservable(this.viewModel.discussion).setModelObservable(this.model.discussion);
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

            this.ratingSynchronizer = new KSync.RatingSynchronizer(this.communicator.rating);
            this.ratingSynchronizer.setViewModelChangedHandler(function (value) {
                return _this.viewModel.rating(value);
            }).setModelObservable(this.model.rating);
        };

        ControllerImpl.prototype.initCommunicator = function () {
            this.communicatorSubscriptions = ([
                this.communicator.received.subscribe(this.onKokiReceived)
            ]);
        };

        ControllerImpl.prototype.dispose = function () {
            this.generalContentSynchronizer.dispose();
            this.contextSynchronizer.dispose();
            this.ratingSynchronizer.dispose();
            this.discussionSynchronizer.dispose();

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
