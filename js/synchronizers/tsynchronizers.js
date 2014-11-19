var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'factories/constructorbased', 'synchronizers/childarraysynchronizer', '../topic'], function(require, exports, Factory, Sync, Topic) {
    var TopicSync = (function (_super) {
        __extends(TopicSync, _super);
        function TopicSync() {
            _super.call(this);
            this.setViewModelFactory(new Factory.Factory(Topic.ViewModel));
            this.setControllerFactory(new Factory.ControllerFactory(Topic.ChildController));
        }
        return TopicSync;
    })(Sync.ObservingChildArraySynchronizer);
    exports.TopicSync = TopicSync;
});
