define(["require", "exports"], function(require, exports) {
    var Model = (function () {
        function Model() {
            this.personalRating = ko.observable('none');
            this.summarizedRatings = ko.observable(new SummarizedRatingCollectionModel);
        }
        Model.prototype.set = function (other) {
            this.personalRating(other.personalRating());
        };
        return Model;
    })();
    exports.Model = Model;

    var ViewModel = (function () {
        function ViewModel() {
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;

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
            this.stronglike = ko.observable();
            this.like = ko.observable();
            this.neutral = ko.observable();
            this.dislike = ko.observable();
            this.strongdislike = ko.observable();
        }
        return SummarizedRatingCollectionModel;
    })();
    exports.SummarizedRatingCollectionModel = SummarizedRatingCollectionModel;
});
