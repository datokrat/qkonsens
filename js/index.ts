///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />

declare var infuser;
infuser.defaults.templateUrl = "templates";

import mdl = require('model')
import vm = require('viewmodel')
import ctr = require('controller')

import CommunicatorImpl = require('communicatorimpl')

var model = new mdl.ModelImpl();
var viewModel = new vm.ViewModel();
var communicator = new CommunicatorImpl;
var controller = new ctr.Controller(model, viewModel, communicator);

ko.applyBindings(viewModel);