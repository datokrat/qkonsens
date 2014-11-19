define(["require", "exports", 'konsenskistecommunicatorimpl', 'topiccommunicatorimpl'], function(require, exports, KokiCommunicatorImpl, TopicImpl) {
    var CommunicatorImpl = (function () {
        function CommunicatorImpl() {
            this.konsenskiste = new KokiCommunicatorImpl.Main;
            this.topic = new TopicImpl.Main();
        }
        return CommunicatorImpl;
    })();

    
    return CommunicatorImpl;
});
