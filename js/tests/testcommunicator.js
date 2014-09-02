define(["require", "exports", 'tests/testkonsenskistecommunicator'], function(require, exports, TestKokiCommunicator) {
    var TestCommunicator = (function () {
        function TestCommunicator() {
            this.konsenskiste = new TestKokiCommunicator;
        }
        return TestCommunicator;
    })();

    
    return TestCommunicator;
});
