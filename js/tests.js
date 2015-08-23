define(["require", "exports", 'tests/tsunit', 'tests/asyncunit', 'tests/locationhash', 'tests/rating', 'tests/comment', 'tests/discussion', 'tests/discussionsynchronizer', 'tests/ratingcommunicator', 'tests/topicnavigationmodel', 'tests/topicnavigation', 'tests/topic', 'tests/winbrowse', 'tests/controller', 'tests/konsenskistemodel', 'tests/kernaussage', 'tests/konsenskistecontroller', 'tests/childarraysynchronizer', 'tests/commentsynchronizer', 'tests/observable', 'tests/content', 'tests/winkonsenskiste', 'tests/wineditkelement', 'tests/contentcommunicator', 'tests/konsenskistecommunicator', 'tests/contentmodel', 'tests/commands', 'tests/kelement', 'tests/statelogic', 'tests/topiclogic', 'tests/kokilogic'], function(require, exports, unit, asyncunit, LocationHash, Rating, Comment, Discussion, DiscussionSynchronizer, TestRatingCommunicator, topicNavigationModel, topicNavigation, topic, winBrowse, controller, kokiModel, kaModel, kokiController, synchronizer, commentSynchronizer, observable, content, winKoki, WinEditKElement, ContentCommunicator, KokiCommunicator, ContentModelTests, CommandTests, KElementTests, StateLogic, TopicLogic, KokiLogic) {
    var test = new unit.Test();
    var asyncTest = new asyncunit.Test();

    asyncTest.addTestClass(new ContentCommunicator(), 'ContentCommunicator');
    asyncTest.addTestClass(new KokiCommunicator(), 'KonsenskisteCommunicator');
    asyncTest.addTestClass(new Rating.TestClass(), 'Rating');
    asyncTest.addTestClass(new LocationHash.Tests, 'LocationHash');

    test.addTestClass(new observable.Tests, 'Observable');
    test.addTestClass(new ContentModelTests(), 'ContentModel');
    test.addTestClass(new content.General(), 'General Content');
    test.addTestClass(new content.Context(), 'Context');

    //test.addTestClass(new context.Tests(), 'Context'); TODO: reactivate
    test.addTestClass(new Comment.Main(), 'Comment');
    test.addTestClass(new Discussion(), 'Discussion');
    test.addTestClass(new TestRatingCommunicator(), 'TestRatingCommunicator');
    test.addTestClass(new DiscussionSynchronizer(), 'DiscussionSynchronizer');
    test.addTestClass(new synchronizer.Tests(), 'ChildArraySynchronizer');
    test.addTestClass(new commentSynchronizer.Tests, 'CommentSynchronizer');
    test.addTestClass(new KElementTests.Main(), 'KElement');
    test.addTestClass(new kaModel.Tests(), 'Kernaussage');
    test.addTestClass(new kokiModel.Tests(), 'KonsenskisteModel');
    test.addTestClass(new kokiController.Tests(), 'KonsenskisteController');
    test.addTestClass(new topicNavigationModel.Tests(), 'TopicNavigationModelImpl');
    test.addTestClass(new topicNavigation.Tests(), 'TopicNavigation');
    test.addTestClass(new topic.Tests(), 'Topic');
    test.addTestClass(new CommandTests.Main(), 'Commands');

    test.addTestClass(new winKoki.Tests(), 'Window: Konsenskiste');
    test.addTestClass(new winBrowse.Tests(), 'Window: Browse');
    test.addTestClass(new WinEditKElement.Tests(), 'Window: EditKElement');

    test.addTestClass(new StateLogic.Tests(), 'StateLogic');
    test.addTestClass(new KokiLogic.Tests(), 'KokiLogic');
    test.addTestClass(new TopicLogic.Tests(), 'TopicLogic');

    test.addTestClass(new controller.Tests(), 'Controller');

    test.showResults(document.getElementById('tests'), test.run());
    asyncTest.run(function (result) {
        return asyncTest.showResults(document.getElementById('asynctests'), result);
    });
});
