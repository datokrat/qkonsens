var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'synchronizers/childarraysynchronizer', 'factories/constructorbased', '../comment'], function (require, exports, Base, Factories, Comment) {
    var Synchronizer = (function (_super) {
        __extends(Synchronizer, _super);
        function Synchronizer(communicator) {
            _super.call(this);
            this.setViewModelFactory(new Factories.Factory(Comment.ViewModel));
            this.setControllerFactory(new Factories.ControllerFactoryEx(Comment.Controller, communicator));
        }
        return Synchronizer;
    })(Base.ObservingChildArraySynchronizer);
    return Synchronizer;
});
