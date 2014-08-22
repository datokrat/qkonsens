///<reference path="../typings/knockout.d.ts" />
///<reference path="../typings/jquery.d.ts" />

import mdl = require('model')
import vm = require('viewmodel')
import ctr = require('controller')

import koki = require('konsenskistemodel')

//import frontendTests = require('tests/frontend')

var model = new mdl.ModelImpl();
var viewModel = new vm.ViewModel();
var controller = new ctr.Controller(model, viewModel);

var konsenskiste = new koki.Model();
model.konsenskiste(konsenskiste);

/*var kernaussage = new kernaussage
model.appendChild()*/

konsenskiste.content.title('Konsenskisten-Titel');

ko.applyBindings(viewModel);