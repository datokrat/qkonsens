define(["require", "exports", 'event', 'itemcontainer', 'tests/testcontentcommunicator', 'tests/testkernaussagecommunicator', 'tests/testdiscussioncommunicator', 'tests/testratingcommunicator'], function(require, exports, Events, ItemContainer, TestContentCommunicator, TestKaCommunicator, TestDiscussionCommunicator, TestRatingCommunicator) {
    var TestKokiCommunicator = (function () {
        function TestKokiCommunicator() {
            this.received = new Events.EventImpl();
            this.kernaussageAppended = new Events.EventImpl();
            this.kernaussageAppendingError = new Events.EventImpl();
            this.testItems = new ItemContainer.Main();
            this.discussion = new TestDiscussionCommunicator(this.testItems);
            this.rating = new TestRatingCommunicator.Main(this.testItems);
            this.content = new TestContentCommunicator();
            this.kernaussage = new TestKaCommunicator({ content: this.content });
        }
        TestKokiCommunicator.prototype.setTestKoki = function (koki) {
            if (typeof koki.id() === 'number') {
                this.testItems.set(koki.id(), koki);
            } else
                throw new Error('TestKokiCommunicator.setTestKoki: koki.id is not a number');
        };

        TestKokiCommunicator.prototype.queryKoki = function (id) {
            try  {
                var koki = this.testItems.get(id);
            } catch (e) {
                throw new Error('TestKokiCommunicator.queryKoki: id not found');
                return;
            }
            this.received.raise({ id: id, konsenskiste: koki });
        };

        TestKokiCommunicator.prototype.createAndAppendKa = function (kokiId, ka) {
            try  {
                var koki = this.testItems.get(kokiId);
            } catch (e) {
                this.kernaussageAppendingError.raise({ konsenskisteId: kokiId, message: "createAndAppendKa: kokiId[" + kokiId + "] not found" });
                return;
            }
            koki.childKas.push(ka);
            this.kernaussageAppended.raise({ konsenskisteId: kokiId, kernaussage: ka });
        };
        return TestKokiCommunicator;
    })();

    
    return TestKokiCommunicator;
});
