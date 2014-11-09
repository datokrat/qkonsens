define(["require", "exports", 'event', 'discocontext', 'common'], function(require, exports, Events, discoContext, common) {
    var Main = (function () {
        function Main() {
            this.ratingSubmitted = new Events.EventImpl();
            this.ratingReceived = new Events.EventImpl();
            this.submissionFailed = new Events.EventImpl();
        }
        Main.prototype.submitRating = function (ratableId, rating) {
            var _this = this;
            var ratings;
            var discoRating;
            common.Callbacks.batch([
                function (r) {
                    discoContext.Ratings.filter(function (it) {
                        return it.ModifiedBy.AuthorId == '12' && it.PostId == this.ratableId.toString();
                    }, { ratableId: ratableId }).toArray().then(function (results) {
                        ratings = results;
                        r();
                    });
                },
                function (r) {
                    if (ratings.length < 1) {
                        discoRating = new Disco.Ontology.Rating({ PostId: ratableId.toString() });
                        discoContext.Ratings.add(discoRating);
                    }
                    if (ratings.length > 1)
                        console.warn('More than one Rating was found for Ratable #' + ratableId);
                    if (ratings.length >= 1) {
                        discoRating = ratings[0];
                    }
                    r();
                },
                function (r) {
                    console.log('send');
                    discoContext.Ratings.attach(discoRating);
                    discoRating.Score = ScoreParser.toDisco(rating);
                    discoContext.saveChanges().then(r).fail(function (args) {
                        return _this.submissionFailed.raise({ ratableId: ratableId, error: args });
                    });
                }
            ], function () {
                _this.ratingSubmitted.raise({ ratableId: ratableId, rating: ScoreParser.fromDisco(discoRating.Score) });
            });
        };
        Main.prototype.queryRating = function (ratableId) {
        };
        return Main;
    })();
    exports.Main = Main;

    var ScoreParser = (function () {
        function ScoreParser() {
        }
        ScoreParser.toDisco = function (qkRating) {
            var index = ScoreParser.strings.indexOf(qkRating);
            if (index >= 0)
                return (index - 2) * 3;
            return null;
        };

        ScoreParser.fromDisco = function (discoRating) {
            if (discoRating)
                return ScoreParser.strings[Math.round(discoRating / 3) + 2];
            else
                return 'none';
        };

        ScoreParser.strings = ['strongdislike', 'dislike', 'neutral', 'like', 'stronglike'];
        return ScoreParser;
    })();
});
