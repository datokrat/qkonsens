var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'synchronizers/childsynchronizer', 'factories/constructorbased', '../contentviewmodel', '../contentcontroller', '../rating', '../discussion', '../environs'], function(require, exports, Base, Factories, ContentViewModel, ContentController, Rating, Discussion, Environs) {
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
        function RatingSynchronizer(args) {
            _super.call(this);

            this.setViewModelFactory(new Factories.Factory(Rating.ViewModel));

            this.controllerFty = new RatingControllerFactory(args);
            this.setControllerFactory(this.controllerFty);
        }
        RatingSynchronizer.prototype.createViewModelObservable = function () {
            return ko.observable();
        };

        RatingSynchronizer.prototype.setRatableModel = function (ratableModel) {
            this.controllerFty.setRatableModel(ratableModel);
        };
        return RatingSynchronizer;
    })(Base.ChildSynchronizer);
    exports.RatingSynchronizer = RatingSynchronizer;

    var LikeRatingSynchronizer = (function (_super) {
        __extends(LikeRatingSynchronizer, _super);
        function LikeRatingSynchronizer(commandProcessor) {
            this.setViewModelFactory(new Factories.Factory(Rating.LikeRatingViewModel));
            this.setControllerFactory(new Factories.ControllerFactoryEx(Rating.LikeRatingController, commandProcessor));
            _super.call(this);
        }
        LikeRatingSynchronizer.prototype.createViewModelObservable = function () {
            return ko.observable();
        };
        return LikeRatingSynchronizer;
    })(Base.ChildSynchronizer);
    exports.LikeRatingSynchronizer = LikeRatingSynchronizer;

    var RatingControllerFactory = (function () {
        function RatingControllerFactory(args) {
            this.args = args;
        }
        RatingControllerFactory.prototype.create = function (m, v) {
            var ret = new Rating.Controller(m, v, this.args);
            ret.setRatableModel(this.ratableModel);
            return ret;
        };

        RatingControllerFactory.prototype.setRatableModel = function (ratableModel) {
            this.ratableModel = ratableModel;
        };
        return RatingControllerFactory;
    })();
    exports.RatingControllerFactory = RatingControllerFactory;

    var DiscussionSynchronizer = (function (_super) {
        __extends(DiscussionSynchronizer, _super);
        function DiscussionSynchronizer(args) {
            _super.call(this);
            this.setViewModelFactory(new Factories.Factory(Discussion.ViewModel));

            this.controllerFty = new DiscussionControllerFactory(args);
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

    var EnvironsSynchronizer = (function (_super) {
        __extends(EnvironsSynchronizer, _super);
        function EnvironsSynchronizer(args) {
            _super.call(this);
            this.setViewModelFactory(new Factories.Factory(Environs.ViewModel));
        }
        return EnvironsSynchronizer;
    })(Base.ChildSynchronizer);
    exports.EnvironsSynchronizer = EnvironsSynchronizer;

    var EnvironsControllerFactory = (function () {
        function EnvironsControllerFactory(args) {
            this.args = args;
        }
        return EnvironsControllerFactory;
    })();

    var DiscussionControllerFactory = (function () {
        function DiscussionControllerFactory(args) {
            this.args = args;
        }
        DiscussionControllerFactory.prototype.create = function (model, viewModel) {
            var ret = new Discussion.Controller(model, viewModel, this.args);
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
