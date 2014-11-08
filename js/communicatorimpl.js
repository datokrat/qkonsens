define(["require", "exports", 'konsenskistecommunicatorimpl'], function(require, exports, KokiCommunicatorImpl) {
    var CommunicatorImpl = (function () {
        function CommunicatorImpl() {
            this.konsenskiste = new KokiCommunicatorImpl.Main;
        }
        return CommunicatorImpl;
    })();

    
    return CommunicatorImpl;
});
