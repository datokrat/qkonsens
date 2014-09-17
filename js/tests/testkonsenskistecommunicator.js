define(["require", "exports", 'event', 'tests/testcontentcommunicator'], function(require, exports, Events, TestContentCommunicator) {
    var TestKokiCommunicator = (function () {
        function TestKokiCommunicator() {
            this.content = new TestContentCommunicator;
            this.received = new Events.EventImpl();
        }
        return TestKokiCommunicator;
    })();

    
    return TestKokiCommunicator;
});
