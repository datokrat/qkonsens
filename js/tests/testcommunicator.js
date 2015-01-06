define(["require", "exports", 'tests/testkonsenskistecommunicator', 'tests/testtopiccommunicator', 'command'], function(require, exports, KokiCommunicator, TopicCommunicator, Commands) {
    var TestCommunicator = (function () {
        function TestCommunicator() {
            this.konsenskiste = new KokiCommunicator.Main;
            this.topic = new TopicCommunicator.Main();
            this.commandProcessor = new Commands.CommandProcessor();
            this.commandProcessor.chain.append(function (cmd) {
                return true;
            });
        }
        return TestCommunicator;
    })();

    
    return TestCommunicator;
});
