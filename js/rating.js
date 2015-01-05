var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'command'], function(require, exports, Commands) {
    var Model = (function () {
        function Model() {
            this.personalRating = ko.observable('none');
            this.summarizedRatings = ko.observable(new SummarizedRatingCollectionModel);
        }
        Model.prototype.set = function (other) {
            this.personalRating(other.personalRating());
            this.summarizedRatings().set(other.summarizedRatings());
        };
        return Model;
    })();
    exports.Model = Model;

    var LikeRatingModel = (function () {
        function LikeRatingModel() {
            this.personalRating = ko.observable('none');
        }
        LikeRatingModel.prototype.set = function (other) {
            this.personalRating(other.personalRating());
        };
        return LikeRatingModel;
    })();
    exports.LikeRatingModel = LikeRatingModel;

    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;

    var LikeRatingViewModel = (function () {
        function LikeRatingViewModel() {
        }
        return LikeRatingViewModel;
    })();
    exports.LikeRatingViewModel = LikeRatingViewModel;

    var Controller = (function () {
        function Controller(model, viewModel, args) {
            var _this = this;
            this.subscriptions = [];
            this.model = model;
            viewModel.id = Controller.idCtr++;
            viewModel.personalRating = model.personalRating;

            viewModel.summarizedRatings = model.summarizedRatings;

            viewModel.select = function (rating) {
                return function () {
                    return setTimeout(function () {
                        args.commandProcessor.processCommand(new SelectRatingCommand(rating, function () {
                            return _this.onRatingSubmitted(rating);
                        }));
                    });
                };
            };
        }
        Controller.prototype.onRatingSubmitted = function (rating) {
            this.model.personalRating(rating);
        };

        Controller.prototype.setRatableModel = function (ratableModel) {
            this.ratableModel = ratableModel;
        };

        Controller.prototype.dispose = function () {
            this.subscriptions.forEach(function (s) {
                return s.dispose();
            });
        };
        Controller.idCtr = 0;
        return Controller;
    })();
    exports.Controller = Controller;

    var LikeRatingController = (function () {
        function LikeRatingController(model, viewModel, commandProcessor) {
            var _this = this;
            this.model = model;
            viewModel.id = LikeRatingController.idCtr++;
            viewModel.personalRating = model.personalRating;

            viewModel.select = function (ratingValue) {
                return function () {
                    return setTimeout(function () {
                        commandProcessor.processCommand(new SelectLikeRatingCommand(ratingValue, function () {
                            return _this.onRatingSubmitted(ratingValue);
                        }));
                    });
                };
            };
        }
        LikeRatingController.prototype.onRatingSubmitted = function (ratingValue) {
            this.model.personalRating(ratingValue);
        };

        LikeRatingController.prototype.dispose = function () {
        };
        LikeRatingController.idCtr = 0;
        return LikeRatingController;
    })();
    exports.LikeRatingController = LikeRatingController;

    var SelectLikeRatingCommand = (function (_super) {
        __extends(SelectLikeRatingCommand, _super);
        function SelectLikeRatingCommand(ratingValue, then) {
            _super.call(this);
            this.ratingValue = ratingValue;
            this.then = then;
        }
        return SelectLikeRatingCommand;
    })(Commands.Command);
    exports.SelectLikeRatingCommand = SelectLikeRatingCommand;

    var SelectRatingCommand = (function () {
        function SelectRatingCommand(ratingValue, then) {
            this.ratingValue = ratingValue;
            this.then = then;
        }
        return SelectRatingCommand;
    })();
    exports.SelectRatingCommand = SelectRatingCommand;

    var SummarizedRatingCollectionViewModel = (function () {
        function SummarizedRatingCollectionViewModel() {
        }
        return SummarizedRatingCollectionViewModel;
    })();
    exports.SummarizedRatingCollectionViewModel = SummarizedRatingCollectionViewModel;

    var SummarizedRatingCollectionModel = (function () {
        function SummarizedRatingCollectionModel() {
            this.stronglike = ko.observable(0);
            this.like = ko.observable(0);
            this.neutral = ko.observable(0);
            this.dislike = ko.observable(0);
            this.strongdislike = ko.observable(0);
        }
        SummarizedRatingCollectionModel.prototype.set = function (rhs) {
            this.stronglike(rhs.stronglike());
            this.like(rhs.like());
            this.neutral(rhs.neutral());
            this.dislike(rhs.dislike());
            this.strongdislike(rhs.strongdislike());
        };
        return SummarizedRatingCollectionModel;
    })();
    exports.SummarizedRatingCollectionModel = SummarizedRatingCollectionModel;
});
