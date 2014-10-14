import unit = require('tests/tsunit')
import asyncunit = require('tests/asyncunit')

import Discussion = require('tests/discussion');
import DiscussionSynchronizer = require('tests/discussionsynchronizer');
import TestRatingCommunicator = require('tests/ratingcommunicator');
import topicNavigationModel = require('tests/topicnavigationmodel')
import topicNavigation = require('tests/topicnavigation')
import controller = require('tests/controller')
import kokiModel = require('tests/konsenskistemodel')
import kaModel = require('tests/kernaussage')
import kokiController = require('tests/konsenskistecontroller')
import synchronizer = require('tests/childarraysynchronizer')
import commentSynchronizer = require('tests/commentsynchronizer')
import observable = require('tests/observable')
import content = require('tests/content')
import context = require('tests/context')
import winKoki = require('tests/winkonsenskiste')
import ContentCommunicator = require('tests/contentcommunicator')
import KokiCommunicator = require('tests/konsenskistecommunicator')
import ContentModelTests = require('tests/contentmodel')

var test = new unit.Test()
var asyncTest = new asyncunit.Test();

asyncTest.addTestClass(new ContentCommunicator(), 'ContentCommunicator');
asyncTest.addTestClass(new KokiCommunicator(), 'KonsenskisteCommunicator');

test.addTestClass(new observable.Tests, 'Observable')
test.addTestClass(new ContentModelTests(), 'ContentModel')
test.addTestClass(new content.General(), 'General Content')
test.addTestClass(new content.Context(), 'Context')
test.addTestClass(new context.Tests(), 'Context')
test.addTestClass(new Discussion(), 'Discussion');
test.addTestClass(new TestRatingCommunicator(), 'TestRatingCommunicator');
test.addTestClass(new DiscussionSynchronizer(), 'DiscussionSynchronizer');
test.addTestClass(new synchronizer.Tests(), 'ChildArraySynchronizer')
test.addTestClass(new commentSynchronizer.Tests, 'CommentSynchronizer')
test.addTestClass(new kaModel.Tests(), 'Kernaussage')
test.addTestClass(new kokiModel.Tests(), 'KonsenskisteModel')
test.addTestClass(new kokiController.Tests(), 'KonsenskisteController')
test.addTestClass(new topicNavigationModel.Tests(), 'TopicNavigationModelImpl')
test.addTestClass(new topicNavigation.Tests(), 'TopicNavigation')

test.addTestClass(new winKoki.Tests(), 'Window: Konsenskiste')

test.addTestClass(new controller.Tests(), 'Controller')

test.showResults(document.getElementById('tests'), test.run())
asyncTest.run( result => asyncTest.showResults(document.getElementById('asynctests'), result) )