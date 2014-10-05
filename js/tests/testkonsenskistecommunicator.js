define(["require", "exports", 'event', 'tests/testcontentcommunicator'], function(require, exports, Events, TestContentCommunicator) {
    var TestKokiCommunicator = (function () {
        function TestKokiCommunicator() {
            this.content = new TestContentCommunicator;
            this.received = new Events.EventImpl();
            this.commentsReceived = new Events.EventImpl();
            this.testKokis = {};
        }
        TestKokiCommunicator.prototype.setTestKoki = function (koki) {
            if (typeof koki.id === 'number') {
                this.testKokis[koki.id] = koki;
            } else
                throw new Error('TestKokiCommunicator.setTestKoki: koki.id is not a number');
        };

        TestKokiCommunicator.prototype.queryKoki = function (id) {
            var koki = this.testKokis[id];
            if (typeof koki !== 'undefined') {
                this.received.raise({ id: id, konsenskiste: koki });
            } else
                throw new Error('TestKokiCommunicator.queryKoki: id not found');
        };

        TestKokiCommunicator.prototype.queryComments = function (id) {
            var koki = this.testKokis[id];
            if (typeof koki !== 'undefined')
                this.commentsReceived.raise({ id: id, comments: koki.comments.get() });
            else
                throw new Error('TestKokiCommunicator.queryComments: id not found');
        };
        return TestKokiCommunicator;
    })();

    
    return TestKokiCommunicator;
});
