define(["require", "exports", '../event'], function(require, exports, Events) {
    var TestCommunicator = (function () {
        function TestCommunicator() {
            this.retrieved = new Events.EventImpl();
        }
        return TestCommunicator;
    })();

    
    return TestCommunicator;
});
