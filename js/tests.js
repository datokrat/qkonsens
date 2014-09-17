define(["require", "exports", 'tests/tsunit', 'tests/topicnavigationmodel', 'tests/topicnavigation', 'tests/controller', 'tests/konsenskistemodel', 'tests/kernaussage', 'tests/konsenskistecontroller', 'tests/childarraysynchronizer', 'tests/content', 'tests/context', 'tests/winkonsenskiste', 'tests/contentmodel'], function(require, exports, unit, topicNavigationModel, topicNavigation, controller, kokiModel, kaModel, kokiController, synchronizer, content, context, winKoki, ContentModelTests) {
    var test = new unit.Test();

    test.addTestClass(new ContentModelTests(), 'ContentModel');
    test.addTestClass(new content.Tests(), 'Content');
    test.addTestClass(new content.TestsWithContext(), 'ContentWithContext');
    test.addTestClass(new context.Tests(), 'Context');
    test.addTestClass(new synchronizer.Tests(), 'ChildArraySynchronizer');
    test.addTestClass(new kaModel.Tests(), 'Kernaussage');
    test.addTestClass(new kokiModel.Tests(), 'KonsenskisteModel');
    test.addTestClass(new kokiController.Tests(), 'KonsenskisteController');
    test.addTestClass(new topicNavigationModel.Tests(), 'TopicNavigationModelImpl');
    test.addTestClass(new topicNavigation.Tests(), 'TopicNavigation');

    test.addTestClass(new winKoki.Tests(), 'Window: Konsenskiste');

    test.addTestClass(new controller.Tests(), 'Controller');

    test.showResults(document.getElementById('tests'), test.run());
});
