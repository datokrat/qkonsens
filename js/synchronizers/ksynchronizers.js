var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'synchronizers/childsynchronizer', 'factories/constructorbased', '../contentviewmodel', '../contentcontroller', '../rating', '../discussion'], function(require, exports, Base, Factories, ContentViewModel, ContentController, Rating, Discussion) {
    var GeneralContentSynchronizer = (function (_super) {
        __extends(GeneralContentSynchronizer, _super);
        function GeneralContentSynchronizer(communicator) {
            _super.call(this);
            this.setViewModelFactory(new Factories.Factory(ContentViewModel.General));
            this.setControllerFactory(new Factories.ControllerFactoryEx(ContentController.General, communicator));
        }
        return GeneralContentSynchronizer;
    })(Base.ChildSynchronizer);
    exports.GeneralContentSynchronizer = GeneralContentSynchronizer;

    var ContextSynchronizer = (function (_super) {
        __extends(ContextSynchronizer, _super);
        function ContextSynchronizer(communicator) {
            _super.call(this);
            this.setViewModelFactory(new Factories.Factory(ContentViewModel.Context));
            this.setControllerFactory(new Factories.ControllerFactoryEx(ContentController.Context, communicator));
        }
        return ContextSynchronizer;
    })(Base.ChildSynchronizer);
    exports.ContextSynchronizer = ContextSynchronizer;

    var RatingSynchronizer = (function (_super) {
        __extends(RatingSynchronizer, _super);
        function RatingSynchronizer(communicator) {
            _super.call(this);
            this.setViewModelFactory(new Factories.Factory(Rating.ViewModel));
            this.setControllerFactory(new Factories.ControllerFactoryEx(Rating.Controller, communicator));
        }
        RatingSynchronizer.prototype.createViewModelObservable = function () {
            return ko.observable();
        };
        return RatingSynchronizer;
    })(Base.ChildSynchronizer);
    exports.RatingSynchronizer = RatingSynchronizer;

    var DiscussionSynchronizer = (function (_super) {
        __extends(DiscussionSynchronizer, _super);
        function DiscussionSynchronizer(communicator) {
            _super.call(this);
            this.setViewModelFactory(new Factories.Factory(Discussion.ViewModel));

            this.controllerFty = new DiscussionControllerFactory(communicator);
            this.setControllerFactory(this.controllerFty);
        }
        DiscussionSynchronizer.prototype.setViewModelContext = function (cxt) {
            this.controllerFty.setViewModelContext(cxt);
            this.controller && this.controller.setViewModelContext(cxt);
            return this;
        };

        DiscussionSynchronizer.prototype.setDiscussableModel = function (m) {
            this.controllerFty.setDiscussableModel(m);
            this.controller && this.controller.setDiscussableModel(m);
            return this;
        };

        DiscussionSynchronizer.prototype.setDiscussableViewModel = function (v) {
            this.controllerFty.setDiscussableViewModel(v);
            this.controller && this.controller.setDiscussableViewModel(v);
            return this;
        };
        return DiscussionSynchronizer;
    })(Base.ChildSynchronizer);
    exports.DiscussionSynchronizer = DiscussionSynchronizer;

    var DiscussionControllerFactory = (function () {
        function DiscussionControllerFactory(communicator) {
            this.communicator = communicator;
        }
        DiscussionControllerFactory.prototype.create = function (model, viewModel) {
            var ret = new Discussion.Controller(model, viewModel, this.communicator);
            ret.setDiscussableModel(this.discussableModel);
            ret.setDiscussableViewModel(this.discussableViewModel);
            ret.setViewModelContext(this.viewModelContext);
            return ret;
        };

        DiscussionControllerFactory.prototype.setViewModelContext = function (cxt) {
            this.viewModelContext = cxt;
        };

        DiscussionControllerFactory.prototype.setDiscussableModel = function (m) {
            this.discussableModel = m;
        };

        DiscussionControllerFactory.prototype.setDiscussableViewModel = function (v) {
            this.discussableViewModel = v;
        };
        return DiscussionControllerFactory;
    })();
});
