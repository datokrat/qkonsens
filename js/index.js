///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />
define(["require", "exports", 'model', 'viewmodel', 'controller', 'konsenskistemodel', 'kernaussagemodel'], function(require, exports, mdl, vm, ctr, koki, ka) {
    
    ready = function () {
    };

    var model = new mdl.ModelImpl();
    var viewModel = new vm.ViewModel();
    var controller = new ctr.Controller(model, viewModel);

    var konsenskiste = new koki.Model();
    model.konsenskiste(konsenskiste);

    var kernaussage = new ka.Model();
    konsenskiste.appendKa(kernaussage);

    konsenskiste.content.title('Konsenskisten-Titel');
    konsenskiste.content.text('Lorem ipsum dolor sit amet');

    kernaussage.content.title('Kernaussagen-Titel');
    kernaussage.content.text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.');

    ko.applyBindings(viewModel);

    ready();
});
