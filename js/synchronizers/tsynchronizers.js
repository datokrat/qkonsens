var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'factories/constructorbased', 'synchronizers/childarraysynchronizer', '../topic'], function(require, exports, Factory, Sync, Topic) {
    var ChildTopicSync = (function (_super) {
        __extends(ChildTopicSync, _super);
        function ChildTopicSync() {
            _super.call(this);
            this.setViewModelFactory(new Factory.Factory(Topic.ChildViewModel));
            this.setControllerFactory(new Factory.ControllerFactory(Topic.ChildController));
        }
        return ChildTopicSync;
    })(Sync.ObservingChildArraySynchronizer);
    exports.ChildTopicSync = ChildTopicSync;
});
