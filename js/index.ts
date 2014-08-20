///<reference path="../typings/knockout.d.ts" />

import mdl = require('model')
import vm = require('viewmodel')
import ctr = require('controller')


var model = new mdl.ModelImpl();
var viewModel = new vm.ViewModel();
var controller = new ctr.Controller(model, viewModel);

ko.applyBindings(viewModel);