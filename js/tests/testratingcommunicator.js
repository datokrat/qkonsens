define(["require", "exports", '../event', '../itemcontainer'], function (require, exports, Events, ItemContainer) {
    var Stub = (function () {
        function Stub() {
            this.ratingSubmitted = new Events.EventImpl();
            this.ratingReceived = new Events.EventImpl();
            this.ratingSubmissionFailed = new Events.EventImpl();
        }
        Stub.prototype.submitRating = function (ratableId, rating) { };
        Stub.prototype.submitLikeRating = function (ratableId, rating) { };
        Stub.prototype.queryRating = function (ratableId) { };
        return Stub;
    })();
    exports.Stub = Stub;
    var Main = (function () {
        function Main(testItems, testLikeRatingItems) {
            if (testItems === void 0) { testItems = new ItemContainer.Main(); }
            if (testLikeRatingItems === void 0) { testLikeRatingItems = new ItemContainer.Main(); }
            this.testItems = testItems;
            this.testLikeRatingItems = testLikeRatingItems;
            this.ratingSubmitted = new Events.EventImpl();
            this.ratingReceived = new Events.EventImpl();
            this.ratingSubmissionFailed = new Events.EventImpl();
        }
        Main.prototype.submitRating = function (ratableId, rating, then) {
            try {
                var ratable = this.testItems.get(ratableId);
                ratable.rating().personalRating(rating);
            }
            catch (e) {
                var error = new Error('could not submit rating.');
                error['innerError'] = e;
                this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: error });
                return;
            }
            then && then();
            this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
        };
        Main.prototype.submitLikeRating = function (ratableId, rating, then) {
            try {
                var ratable = this.testLikeRatingItems.get(ratableId);
                ratable.rating().personalRating(rating);
            }
            catch (e) {
                var error = new Error('could not submit rating.');
                error['innerError'] = e;
                //this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: error});
                return;
            }
            then && then();
            //this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
        };
        Main.prototype.queryRating = function (ratableId) {
            try {
                var ratable = this.testItems.get(ratableId);
            }
            catch (e) {
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
