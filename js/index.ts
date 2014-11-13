///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />

declare var infuser;
infuser.defaults.templateUrl = "templates";

import mdl = require('model')
import vm = require('viewmodel')
import ctr = require('controller')

import koki = require('konsenskistemodel')
import ka = require('kernaussagemodel')

import CommunicatorImpl = require('communicatorimpl')

var model = new mdl.ModelImpl();
var konsenskiste = new koki.Model;
konsenskiste.id(12);
model.konsenskiste(konsenskiste);
var viewModel = new vm.ViewModel();
var communicator = new CommunicatorImpl;
communicator.konsenskiste.query(12);
var controller = new ctr.Controller(model, viewModel, communicator);

ko.applyBindings(viewModel);