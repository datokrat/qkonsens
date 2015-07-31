///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />
define(["require", "exports", 'model', 'viewmodel', 'controller', 'communicatorimpl'], function(require, exports, mdl, vm, ctr, CommunicatorImpl) {
    
    infuser.defaults.templateUrl = "templates";

    var model = new mdl.ModelImpl();
    var viewModel = new vm.ViewModel();
    var communicator = new CommunicatorImpl;
    var controller = new ctr.Controller(model, viewModel, communicator);

    ko.applyBindings(viewModel);
});
