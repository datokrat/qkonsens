define(["require", "exports", 'tests/testcontentcommunicator'], function(require, exports, TestContentCommunicator) {
    var TestKokiCommunicator = (function () {
        function TestKokiCommunicator() {
            this.content = new TestContentCommunicator;
        }
        return TestKokiCommunicator;
    })();

    
    return TestKokiCommunicator;
});
