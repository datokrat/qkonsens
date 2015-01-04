///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />
define(["require", "exports", 'model', 'viewmodel', 'controller', 'konsenskistemodel', 'communicatorimpl'], function(require, exports, mdl, vm, ctr, koki, CommunicatorImpl) {
    
    infuser.defaults.templateUrl = "templates";

    var model = new mdl.ModelImpl();
    var konsenskiste = new koki.Model;
    konsenskiste.id(12);

    //model.konsenskiste(konsenskiste);
    var viewModel = new vm.ViewModel();
    var communicator = new CommunicatorImpl;

    //communicator.konsenskiste.query(12);
    var controller = new ctr.Controller(model, viewModel, communicator);

    ko.applyBindings(viewModel);
});
