///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />
define(["require", "exports", 'model', 'viewmodel', 'controller', 'konsenskistemodel', 'communicatorimpl'], function(require, exports, mdl, vm, ctr, koki, CommunicatorImpl) {
    
    infuser.defaults.templateUrl = "templates";

    var model = new mdl.ModelImpl();
    var viewModel = new vm.ViewModel();
    var communicator = new CommunicatorImpl;
    var controller = new ctr.Controller(model, viewModel, communicator);

    var konsenskiste = new koki.Model;
    konsenskiste.id(12);
    model.konsenskiste(konsenskiste);

    communicator.konsenskiste.query(12);

    ko.applyBindings(viewModel);
});
