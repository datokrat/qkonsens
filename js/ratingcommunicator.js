define(["require", "exports", 'event', 'rating', 'discocontext', 'common'], function(require, exports, Events, Rating, discoContext, common) {
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
                    if (ratings.length == 0 && rating != 'none') {
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
                    if (rating != 'none') {
                        discoContext.Ratings.attach(discoRating);
                        discoRating.Score = ScoreParser.toDisco(rating);
                        discoContext.saveChanges().then(r).fail(function (args) {
                            return _this.submissionFailed.raise({ ratableId: ratableId, error: args });
                        });
                    } else if (discoRating) {
                        //discoContext.Ratings.remove(discoRating);
                        _this.submissionFailed.raise({ ratableId: ratableId, error: new Error('rating deletion not implemented') });
                        r();
                    } else {
                        r();
                    }
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

    var Parser = (function () {
        function Parser() {
        }
        Parser.prototype.parse = function (rawRatings, out) {
            out = out || new Rating.Model();
            out.personalRating('none');
            rawRatings.forEach(function (rawRating) {
                if (rawRating.ModifiedBy.AuthorId == '12') {
                    out.personalRating(ScoreParser.fromDisco(rawRating.Score));
                }
            });
            return out;
        };
        return Parser;
    })();
    exports.Parser = Parser;

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
            if (discoRating != null)
                return ScoreParser.strings[Math.round(discoRating / 3) + 2];
            else
                return 'none';
        };

        ScoreParser.strings = ['strongdislike', 'dislike', 'neutral', 'like', 'stronglike'];
        return ScoreParser;
    })();
    exports.ScoreParser = ScoreParser;
});
