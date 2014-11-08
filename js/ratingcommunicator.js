define(["require", "exports", 'discocontext', 'common'], function(require, exports, discoContext, common) {
    var Main = (function () {
        function Main() {
        }
        Main.prototype.submitRating = function (ratableId, rating) {
            var _this = this;
            var ratings;
            common.Callbacks.batch([
                function (r) {
                    discoContext.Ratings.filter(function (it) {
                        return it.ModifiedBy.AuthorId == '12' && it.PostId == _this.ratableId.toString();
                    }, { ratableId: ratableId }).toArray().then(function (results) {
                        ratings = results;
                        r();
                    });
                },
                function (r) {
                    console.log(ratings);
                    r();
                }
            ], function () {
            });
        };
        Main.prototype.queryRating = function (ratableId) {
        };
        return Main;
    })();
    exports.Main = Main;
});
