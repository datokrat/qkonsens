define(["require", "exports", 'event'], function(require, exports, Events) {
    var ContentCommunicator = (function () {
        function ContentCommunicator() {
            this.generalContentRetrieved = new Events.EventImpl();
            this.contextRetrieved = new Events.EventImpl();
        }
        ContentCommunicator.prototype.query = function (id) {
            throw new Error('not implemented');
        };

        ContentCommunicator.prototype.queryGeneral = function (id) {
            throw new Error('not implemented');
        };

        ContentCommunicator.prototype.queryContext = function (id) {
            throw new Error('not implemented');
        };
        return ContentCommunicator;
    })();

    
    return ContentCommunicator;
});
