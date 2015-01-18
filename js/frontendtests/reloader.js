///<reference path="../typings/knockout.d.ts" />
define(["require", "exports"], function(require, exports) {
    var koTypes = ko;
    var ko = top.frames[2].ko;
    top.frames[2].infuser.defaults.templateUrl = "templates";

    var page = ko.observable();
    var model = ko.observable();
    var controller = ko.observable();
    var communicator = ko.observable();

    try  {
        //TODO: find less dirty solution to reference "$root.isAdmin" and make it more testable
        ko.applyBindings({ page: page, isAdmin: ko.observable(true) });
    } catch (e) {
    }

    var exportVar = { viewModel: page, controller: controller, model: model, communicator: communicator };
    
    return exportVar;
});
