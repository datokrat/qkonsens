define(["require", "exports", 'contentmodel', 'rating', 'discussion'], function(require, exports, ContentModel, Rating, Discussion) {
    var Model = (function () {
        function Model() {
            this.id = ko.observable();
            this.general = ko.observable(new ContentModel.General);
            this.context = ko.observable(new ContentModel.Context);
            this.rating = ko.observable(new Rating.Model);
            this.discussion = ko.observable(new Discussion.Model);
        }
        Model.prototype.set = function (model) {
            this.id(model.id());
            this.general().set(model.general());
            this.context().set(model.context());
            this.rating().set(model.rating());
            this.discussion(model.discussion());
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
});
/*export class Controller {
constructor(model, viewModel, communicator) {
this.initDiscussion();
this.initGeneralContent();
this.initContext();
this.initRating();
}
}*/
