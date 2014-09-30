define(["require", "exports", 'konsenskistecommunicatorimpl'], function(require, exports, KokiCommunicatorImpl) {
    var CommunicatorImpl = (function () {
        function CommunicatorImpl() {
            this.konsenskiste = new KokiCommunicatorImpl;
        }
        return CommunicatorImpl;
    })();

    
    return CommunicatorImpl;
});
