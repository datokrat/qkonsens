///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />
define(["require", "exports", 'model', 'viewmodel', 'controller', 'konsenskistemodel'], function(require, exports, mdl, vm, ctr, koki) {
    //import frontendTests = require('tests/frontend')
    var model = new mdl.ModelImpl();
    var viewModel = new vm.ViewModel();
    var controller = new ctr.Controller(model, viewModel);

    var konsenskiste = new koki.Model();
    model.konsenskiste(konsenskiste);

    /*var kernaussage = new kernaussage
    model.appendChild()*/
    konsenskiste.content.title('Konsenskisten-Titel');

    ko.applyBindings(viewModel);
});
