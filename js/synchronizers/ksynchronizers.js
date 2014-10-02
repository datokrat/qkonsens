var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'synchronizers/childsynchronizer', 'factories/constructorbased', '../contentviewmodel', '../contentcontroller', '../rating'], function(require, exports, Base, Factories, ContentViewModel, ContentController, Rating) {
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
        function RatingSynchronizer() {
            _super.call(this);
            this.setViewModelFactory(new Factories.Factory(Rating.ViewModel));
            this.setControllerFactory(new Factories.ControllerFactory(Rating.Controller));
        }
        return RatingSynchronizer;
    })(Base.ChildSynchronizer);
    exports.RatingSynchronizer = RatingSynchronizer;
});
