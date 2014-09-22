define(["require", "exports", '../event'], function(require, exports, Events) {
    var TestCommunicator = (function () {
        function TestCommunicator() {
            this.retrieved = new Events.EventImpl();
            this.testContent = {};
        }
        TestCommunicator.prototype.setTestContent = function (content) {
            if (typeof content.id === 'number') {
                this.testContent[content.id] = content;
            } else
                throw new Error('TestContentCommunicator.setTestContent: content.id is not a number');
        };

        TestCommunicator.prototype.queryContent = function (id) {
            var content = this.testContent[id];
            if (typeof content !== 'undefined') {
                this.retrieved.raise({ id: id, content: content });
            } else
                throw new Error('TestContentCommunicator.queryContent: id not found');
        };
        return TestCommunicator;
    })();

    
    return TestCommunicator;
});
