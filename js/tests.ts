import unit = require('tests/tsunit')

import topicNavigationModel = require('tests/topicnavigationmodel')
import topicNavigation = require('tests/topicnavigation')
import controller = require('tests/controller')
import kokiModel = require('tests/konsenskistemodel')
import kaModel = require('tests/kernaussagemodel')
import kokiController = require('tests/konsenskistecontroller')
import synchronizer = require('tests/childarraysynchronizer')

var test = new unit.Test()

test.addTestClass(new synchronizer.Tests(), 'ChildArraySynchronizer')
test.addTestClass(new kaModel.Tests(), 'KernaussageModel')
test.addTestClass(new kokiModel.Tests(), 'KonsenskisteModel')
test.addTestClass(new kokiController.Tests(), 'KonsenskisteController')
test.addTestClass(new topicNavigationModel.Tests(), 'TopicNavigationModelImpl')
test.addTestClass(new topicNavigation.Tests(), 'TopicNavigation')
test.addTestClass(new controller.Tests(), 'Controller')

test.showResults(document.getElementById('tests'), test.run())