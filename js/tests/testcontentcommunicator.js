define(["require", "exports", '../event'], function(require, exports, Events) {
    var TestCommunicator = (function () {
        function TestCommunicator() {
            this.generalContentRetrieved = new Events.EventImpl();
            this.contextRetrieved = new Events.EventImpl();
            this.generalTestContent = {};
        }
        TestCommunicator.prototype.setGeneralTestContent = function (generalContent) {
            if (typeof generalContent.id === 'number') {
                this.generalTestContent[generalContent.id] = generalContent;
            } else
                throw new Error('TestContentCommunicator.setGeneralTestContent: generalContent.id is not a number');
        };

        TestCommunicator.prototype.queryGeneral = function (id) {
            var generalContent = this.generalTestContent[id];
            if (typeof generalContent !== 'undefined') {
                this.generalContentRetrieved.raise({ general: generalContent });
            } else
                throw new Error('TestContentCommunicator.queryGeneralContent: id not found');
        };

        TestCommunicator.prototype.queryContext = function (id) {
        };

        TestCommunicator.prototype.query = function (id) {
        };
        return TestCommunicator;
    })();

    
    return TestCommunicator;
});
