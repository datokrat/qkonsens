var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'discussablecommunicator', 'contentcommunicatorimpl', 'event'], function(require, exports, DiscussableCommunicator, ContentCommunicatorImpl, Events) {
    var KernaussageCommunicatorImpl = (function (_super) {
        __extends(KernaussageCommunicatorImpl, _super);
        function KernaussageCommunicatorImpl(cxt) {
            if (typeof cxt === "undefined") { cxt = { content: new ContentCommunicatorImpl }; }
            _super.call(this);
            this.received = new Events.EventImpl();
            this.content = cxt.content;
        }
        KernaussageCommunicatorImpl.prototype.query = function (id) {
            throw new Error('not implemented');
        };
        return KernaussageCommunicatorImpl;
    })(DiscussableCommunicator.Main);

    
    return KernaussageCommunicatorImpl;
});
