///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />

declare var infuser;
infuser.defaults.templateUrl = "templates";

import mdl = require('model')
import vm = require('viewmodel')
import ctr = require('controller')

import koki = require('konsenskistemodel')
import ka = require('kernaussagemodel')

import TestCommunicator = require('tests/testcommunicator')

var model = new mdl.ModelImpl();
var viewModel = new vm.ViewModel();
var communicator = new TestCommunicator();
var controller = new ctr.Controller(model, viewModel, communicator);

var konsenskiste = new koki.Model();
model.konsenskiste(konsenskiste);

var kernaussage = new ka.Model();
konsenskiste.appendKa(kernaussage);

konsenskiste.general().title('Konsenskisten-Titel');
konsenskiste.general().text('Lorem ipsum dolor sit amet');
konsenskiste.context().text('ipsum (lat.): selbst');

kernaussage.general().title('Kernaussagen-Titel');
kernaussage.general().text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.');
kernaussage.context().text('blablablablub');

ko.applyBindings(viewModel);