define(["require", "exports", 'tests/tsunit', 'tests/asyncunit', 'tests/discussion', 'tests/discussionsynchronizer', 'tests/topicnavigationmodel', 'tests/topicnavigation', 'tests/controller', 'tests/konsenskistemodel', 'tests/kernaussage', 'tests/konsenskistecontroller', 'tests/childarraysynchronizer', 'tests/commentsynchronizer', 'tests/observable', 'tests/content', 'tests/context', 'tests/winkonsenskiste', 'tests/contentcommunicator', 'tests/konsenskistecommunicator', 'tests/contentmodel'], function(require, exports, unit, asyncunit, Discussion, DiscussionSynchronizer, topicNavigationModel, topicNavigation, controller, kokiModel, kaModel, kokiController, synchronizer, commentSynchronizer, observable, content, context, winKoki, ContentCommunicator, KokiCommunicator, ContentModelTests) {
    var test = new unit.Test();
    var asyncTest = new asyncunit.Test();

    asyncTest.addTestClass(new ContentCommunicator(), 'ContentCommunicator');
    asyncTest.addTestClass(new KokiCommunicator(), 'KonsenskisteCommunicator');

    test.addTestClass(new observable.Tests, 'Observable');
    test.addTestClass(new ContentModelTests(), 'ContentModel');
    test.addTestClass(new content.General(), 'General Content');
    test.addTestClass(new content.Context(), 'Context');
    test.addTestClass(new context.Tests(), 'Context');
    test.addTestClass(new Discussion(), 'Discussion');
    test.addTestClass(new DiscussionSynchronizer(), 'DiscussionSynchronizer');
    test.addTestClass(new synchronizer.Tests(), 'ChildArraySynchronizer');
    test.addTestClass(new commentSynchronizer.Tests, 'CommentSynchronizer');
    test.addTestClass(new kaModel.Tests(), 'Kernaussage');
    test.addTestClass(new kokiModel.Tests(), 'KonsenskisteModel');
    test.addTestClass(new kokiController.Tests(), 'KonsenskisteController');
    test.addTestClass(new topicNavigationModel.Tests(), 'TopicNavigationModelImpl');
    test.addTestClass(new topicNavigation.Tests(), 'TopicNavigation');

    test.addTestClass(new winKoki.Tests(), 'Window: Konsenskiste');

    test.addTestClass(new controller.Tests(), 'Controller');

    test.showResults(document.getElementById('tests'), test.run());
    asyncTest.run(function (result) {
        return asyncTest.showResults(document.getElementById('asynctests'), result);
    });
});
