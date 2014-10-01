define(["require", "exports"], function(require, exports) {
    var Model = (function () {
        function Model() {
            this.personalRating = ko.observable('none');
        }
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
        function Controller(model, viewModel) {
            viewModel.id = Controller.idCtr++;
            viewModel.personalRating = model.personalRating;
            viewModel.summarizedRatings = ko.observable({
                stronglike: ko.observable(0), like: ko.observable(0), neutral: ko.observable(0),
                dislike: ko.observable(0), strongdislike: ko.observable(0)
            });

            viewModel.select = function (rating) {
                return function () {
                    return viewModel.personalRating(rating);
                };
            };
        }
        Controller.idCtr = 0;
        return Controller;
    })();
    exports.Controller = Controller;

    var SummarizedRatingCollection = (function () {
        function SummarizedRatingCollection() {
        }
        return SummarizedRatingCollection;
    })();
    exports.SummarizedRatingCollection = SummarizedRatingCollection;
});
