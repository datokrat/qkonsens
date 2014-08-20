///<reference path="../typings/knockout.d.ts" />
define(["require", "exports", 'model', 'viewmodel', 'controller'], function(require, exports, mdl, vm, ctr) {
    var model = new mdl.ModelImpl();
    var viewModel = new vm.ViewModel();
    var controller = new ctr.Controller(model, viewModel);

    ko.applyBindings(viewModel);
});
