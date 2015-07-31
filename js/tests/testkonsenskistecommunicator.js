define(["require", "exports", '../id', 'event', 'itemcontainer', 'tests/testcontentcommunicator', 'tests/testkernaussagecommunicator', 'tests/testdiscussioncommunicator', 'tests/testratingcommunicator', '../konsenskistemodel', '../kernaussagemodel'], function(require, exports, newId, Events, ItemContainer, TestContentCommunicator, TestKaCommunicator, TestDiscussionCommunicator, TestRatingCommunicator, KonsenskisteModel, KernaussageModel) {
    var Main = (function () {
        function Main() {
            this.received = new Events.EventImpl();
            this.receiptError = new Events.EventImpl();
            this.kernaussageAppended = new Events.EventImpl();
            this.kernaussageAppendingError = new Events.EventImpl();
            this.testItems = new ItemContainer.Main();
            this.discussion = new TestDiscussionCommunicator();
            this.rating = new TestRatingCommunicator.Main(this.testItems);
            this.discussion.insertTestItemContainer(this.testItems);
            this.content = new TestContentCommunicator();
            this.kernaussage = new TestKaCommunicator({ content: this.content });
        }
        Main.prototype.setTestKoki = function (koki) {
            if (typeof koki.id() === 'number') {
                this.testItems.set(koki.id(), koki);
            } else
                throw new Error('TestKokiCommunicator.setTestKoki: koki.id is not a number');
        };

        Main.prototype.query = function (id, out) {
            try  {
                out = out || new KonsenskisteModel.Model();
                out.id(id);
                out.queryState().loading(true);
                out.set(this.testItems.get(id));
            } catch (e) {
                out.queryState().error('id[' + id + '] not found');
                out.queryState().loading(false);
                this.receiptError.raise({ id: id, message: 'id[' + id + '] not found', konsenskiste: out });
                return out;
            }
            out.queryState().error(null);
            out.queryState().loading(false);
            this.received.raise({ id: id, konsenskiste: out });
            return out;
        };

        Main.prototype.createAndAppendKa = function (kokiId, kaData) {
            try  {
                var koki = this.testItems.get(kokiId);
            } catch (e) {
                this.kernaussageAppendingError.raise({
                    konsenskisteId: kokiId,
                    message: "createAndAppendKa: kokiId[" + kokiId + "] not found"
                });
                return;
            }
            var ka = new KernaussageModel.Model();
            ka.general().title(kaData.title);
            ka.general().text(kaData.text);
            ka.id(newId());
            this.kernaussage.setTestKa(ka);
            koki.childKas.push(ka);
            this.kernaussageAppended.raise({
                konsenskisteId: kokiId,
                kernaussageId: ka.id(),
                kernaussageData: kaData
            });
        };

        Main.prototype.create = function (kokiData, parentTopicId, then) {
            var koki = new KonsenskisteModel.Model();
            koki.id(newId());
            koki.general().title(kokiData.title);
            koki.general().text(kokiData.text);
            this.testItems.set(koki.id(), koki);
            then(koki.id());
        };
        return Main;
    })();
    exports.Main = Main;

    var Stub = (function () {
        function Stub() {
            this.content = new TestContentCommunicator();
            this.kernaussage = new TestKaCommunicator();
            this.received = new Events.EventImpl();
            this.receiptError = new Events.EventImpl();
            this.kernaussageAppended = new Events.EventImpl();
            this.kernaussageAppendingError = new Events.EventImpl();
            this.discussion = new TestDiscussionCommunicator();
            this.rating = new TestRatingCommunicator.Stub();
        }
        Stub.prototype.query = function (id, out) {
            throw new Error('not implemented');
        };
        Stub.prototype.createAndAppendKa = function (kokiId, ka) {
            throw new Error('not implemented');
        };
        Stub.prototype.create = function (koki, parentTopicId, then) {
            throw new Error('not implemented');
        };
        return Stub;
    })();
    exports.Stub = Stub;
});
