define(["require", "exports", '../event'], function(require, exports, Events) {
    var TestCommunicator = (function () {
        function TestCommunicator() {
            this.contentRetrieved = new Events.EventImpl();
        }
        return TestCommunicator;
    })();

    
    return TestCommunicator;
});
