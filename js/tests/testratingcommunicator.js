define(["require", "exports", '../event', '../itemcontainer'], function(require, exports, Events, ItemContainer) {
    var Main = (function () {
        function Main(testItems) {
            if (typeof testItems === "undefined") { testItems = new ItemContainer.Main(); }
            this.testItems = testItems;
            this.ratingSubmitted = new Events.EventImpl();
            this.ratingReceived = new Events.EventImpl();
            this.submissionFailed = new Events.EventImpl();
        }
        Main.prototype.submitRating = function (ratableId, rating) {
            try  {
                var ratable = this.testItems.get(ratableId);
                ratable.rating().personalRating(rating);
            } catch (e) {
                var error = new Error('could not submit rating.');
                error['innerError'] = e;
                this.submissionFailed.raise({ ratableId: ratableId, error: error });
                return;
            }
            this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
        };

        Main.prototype.queryRating = function (ratableId) {
            try  {
                var ratable = this.testItems.get(ratableId);
            } catch (e) {
                return;
            }
            this.ratingReceived.raise({ ratableId: ratableId, rating: ratable.rating() });
        };

        Main.prototype.setTestRatable = function (value) {
            this.testItems.set(value.id(), value);
        };
        return Main;
    })();
    exports.Main = Main;
});
