define(["require", "exports", 'event', 'rating', 'discocontext', 'disco', 'common'], function(require, exports, Events, Rating, discoContext, disco, common) {
    var Main = (function () {
        function Main() {
            this.ratingSubmitted = new Events.EventImpl();
            this.ratingReceived = new Events.EventImpl();
            this.ratingSubmissionFailed = new Events.EventImpl();
        }
        Main.prototype.submitRating = function (ratableId, rating, then) {
            var _this = this;
            var onSuccess = function () {
                then && then();
                _this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
            };
            var onError = function (err) {
                _this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: err });
            };

            if (rating != 'none') {
                this.submitDiscoRating(ratableId, ScoreParser.fromRatingToDisco(rating), { then: onSuccess, fail: onError });
            } else {
                onError(new Error('rating deletion not implemented'));
            }
        };
        Main.prototype.submitLikeRating = function (ratableId, rating, then) {
            var onSuccess = function () {
                then && then();
                //this.ratingSubmitted.raise({ ratableId: ratableId, rating: rating });
            };
            var onError = function (err) {
                //this.ratingSubmissionFailed.raise({ ratableId: ratableId, error: err });
            };

            if (rating != 'none') {
                this.submitDiscoRating(ratableId, ScoreParser.fromLikeRatingToDisco(rating), { then: onSuccess, fail: onError });
            } else {
                onError(new Error('rating deletion not implemented'));
            }
        };

        Main.prototype.submitDiscoRating = function (ratableId, score, callbacks) {
            if (typeof callbacks === "undefined") { callbacks = {}; }
            var ratings;
            var discoRating;
            var userName = disco.AuthData().user;
            common.Callbacks.batch([
                function (r) {
                    discoContext.Ratings.filter(function (it) {
                        return it.ModifiedBy.Author.Alias == this.userName && it.PostId == this.ratableId.toString();
                    }, { userName: userName, ratableId: ratableId }).toArray().then(function (results) {
                        ratings = results;
                        r();
                    });
                },
                function (r) {
                    if (ratings.length == 0) {
                        discoRating = new Disco.Ontology.Rating({ PostId: ratableId.toString() });
                        discoContext.Ratings.add(discoRating);
                    }
                    if (ratings.length > 1)
                        console.warn('More than one Rating was found for Ratable #' + ratableId);
                    if (ratings.length >= 1) {
                        discoRating = ratings[0];
                        discoContext.Ratings.attach(discoRating);
                    }
                    r();
                },
                function (r) {
                    discoRating.Score = score;
                    discoRating.UserId = '12';
                    discoContext.saveChanges().then(r).fail(function (args) {
                        return callbacks.fail && callbacks.fail(args);
                    });
                }
            ], function () {
                callbacks.then && callbacks.then();
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
            var userName = disco.AuthData().user;
            out = out || new Rating.Model();
            out.personalRating('none');
            rawRatings.forEach(function (rawRating) {
                var ratingValue = ScoreParser.fromDisco(rawRating.Score);
                if (rawRating.ModifiedBy.Author.Alias == userName) {
                    out.personalRating(ratingValue);
                }
                var summaryObservable = out.summarizedRatings()[ratingValue];
                summaryObservable(summaryObservable() ? summaryObservable() + 1 : 1);
            });
            return out;
        };

        Parser.prototype.parseLikeRating = function (rawRatings, out) {
            var rating = this.parse(rawRatings);
            out = out || new Rating.LikeRatingModel();
            out.personalRating(ScoreParser.fromRatingToLikeRating(rating.personalRating()));
            out.summarizedRatings(rating.summarizedRatings());
            return out;
        };
        return Parser;
    })();
    exports.Parser = Parser;

    var ScoreParser = (function () {
        function ScoreParser() {
        }
        ScoreParser.fromRatingToDisco = function (qkRating) {
            var index = ScoreParser.strings.indexOf(qkRating);
            if (index >= 0)
                return (index - 2) * 3;
            return null;
        };
        ScoreParser.fromLikeRatingToDisco = function (qkRating) {
            return ScoreParser.fromRatingToDisco(qkRating);
        };

        ScoreParser.fromRatingToLikeRating = function (rating) {
            if (rating == 'like' || rating == 'stronglike')
                return 'like';
            else if (rating == 'dislike' || rating == 'strongdislike')
                return 'dislike';
            else
                return rating;
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
