///<reference path="../typings/jquery.d.ts" />
define(["require", "exports", 'tests/asyncunit', 'frontendtests/reloader', 'frontendtests/kokiwin', 'model', 'viewmodel', 'controller', 'konsenskistemodel', 'tests/testcommunicator'], function(require, exports, unit, reloader, kokiWin, mdl, vm, ctr, koki, TestCommunicator) {
    var model = new mdl.ModelImpl;
    var viewModel = new vm.ViewModel;
    var communicator = new TestCommunicator;
    var controller = new ctr.Controller(model, viewModel, communicator);

    var konsenskiste = new koki.Model();
    model.konsenskiste(konsenskiste);

    reloader.viewModel(viewModel);
    reloader.model(model);
    reloader.communicator(communicator);
    reloader.controller(controller);

    setTimeout(function () {
        console.log('test mode start');

        var test = new unit.Test();

        test.addTestClass(new kokiWin.Tests());

        test.run(function (result) {
            return test.showResults(document.getElementById('tests'), result);
        });
    }, 1000);
});
