///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />
define(["require", "exports", 'model', 'viewmodel', 'controller', 'konsenskistemodel', 'kernaussagemodel', 'tests/testcommunicator'], function(require, exports, mdl, vm, ctr, koki, ka, TestCommunicator) {
    
    ready = function () {
    };

    infuser.defaults.templateUrl = "templates";

    var model = new mdl.ModelImpl();
    var viewModel = new vm.ViewModel();
    var communicator = new TestCommunicator();
    var controller = new ctr.Controller(model, viewModel, communicator);

    var konsenskiste = new koki.Model();
    model.konsenskiste(konsenskiste);

    var kernaussage = new ka.Model();
    konsenskiste.appendKa(kernaussage);

    konsenskiste.content().title('Konsenskisten-Titel');
    konsenskiste.content().text('Lorem ipsum dolor sit amet');
    konsenskiste.content().context().text('ipsum (lat.): selbst');

    kernaussage.content.title('Kernaussagen-Titel');
    kernaussage.content.text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.');
    kernaussage.content.context().text('blablablablub');

    ko.applyBindings(viewModel);

    ready();
});
