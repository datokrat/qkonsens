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
        function Controller(model, viewModel, communicator) {
            var _this = this;
            this.subscriptions = [];
            this.model = model;
            viewModel.id = Controller.idCtr++;
            viewModel.personalRating = model.personalRating;

            /*viewModel.summarizedRatings = ko.observable({
            stronglike: ko.observable(0), like: ko.observable(0), neutral: ko.observable(0),
            dislike: ko.observable(0), strongdislike: ko.observable(0)
            });*/
            viewModel.summarizedRatings = model.summarizedRatings;

            viewModel.select = function (rating) {
                return function () {
                    return setTimeout(function () {
                        //viewModel.personalRating(rating);
                        if (_this.ratableModel) {
                            communicator.submitRating(_this.ratableModel.id(), rating);
                        } else {
                            throw new Error('cannot submit rating - no ratableModel set');
                        }
                    });
                };
            };

            this.subscriptions = [
                communicator.ratingSubmitted.subscribe(this.onRatingSubmitted.bind(this)),
                communicator.ratingReceived.subscribe(this.onRatingChanged.bind(this))
            ];
        }
        Controller.prototype.onRatingSubmitted = function (args) {
            if (this.ratableModel && (args.ratableId == this.ratableModel.id()))
                this.model.personalRating(args.rating);
        };

        Controller.prototype.onRatingChanged = function (args) {
            if (this.ratableModel && (args.ratableId == this.ratableModel.id()))
                this.model.personalRating(args.rating.personalRating());
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
