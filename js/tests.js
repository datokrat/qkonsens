define(["require", "exports", 'tests/tsunit', 'tests/topicnavigationmodel', 'tests/topicnavigation', 'tests/controller', 'tests/konsenskistemodel', 'tests/kernaussagemodel', 'tests/konsenskistecontroller', 'tests/childarraysynchronizer'], function(require, exports, unit, topicNavigationModel, topicNavigation, controller, kokiModel, kaModel, kokiController, synchronizer) {
    var test = new unit.Test();

    test.addTestClass(new synchronizer.Tests(), 'ChildArraySynchronizer');
    test.addTestClass(new kaModel.Tests(), 'KernaussageModel');
    test.addTestClass(new kokiModel.Tests(), 'KonsenskisteModel');
    test.addTestClass(new kokiController.Tests(), 'KonsenskisteController');
    test.addTestClass(new topicNavigationModel.Tests(), 'TopicNavigationModelImpl');
    test.addTestClass(new topicNavigation.Tests(), 'TopicNavigation');
    test.addTestClass(new controller.Tests(), 'Controller');

    test.showResults(document.getElementById('tests'), test.run());
});
