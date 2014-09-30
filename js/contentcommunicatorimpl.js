define(["require", "exports", 'event'], function(require, exports, Events) {
    var ContentCommunicator = (function () {
        function ContentCommunicator() {
            this.generalContentRetrieved = new Events.EventImpl();
            this.contextRetrieved = new Events.EventImpl();
        }
        ContentCommunicator.prototype.query = function (id) {
        };

        ContentCommunicator.prototype.queryGeneral = function (id) {
        };

        ContentCommunicator.prototype.queryContext = function (id) {
        };
        return ContentCommunicator;
    })();

    
    return ContentCommunicator;
});
