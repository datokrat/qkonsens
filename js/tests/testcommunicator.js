define(["require", "exports", 'tests/testkonsenskistecommunicator', 'tests/testtopiccommunicator'], function(require, exports, KokiCommunicator, TopicCommunicator) {
    var TestCommunicator = (function () {
        function TestCommunicator() {
            this.konsenskiste = new KokiCommunicator;
            this.topic = new TopicCommunicator.Main();
        }
        return TestCommunicator;
    })();

    
    return TestCommunicator;
});
