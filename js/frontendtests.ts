///<reference path="../typings/jquery.d.ts" />

import unit = require('tests/asyncunit')
import test = require('tests/test')

import reloader = require('frontendtests/reloader')
import kokiWin = require('frontendtests/kokiwin')

import mdl = require('model')
import vm = require('viewmodel')
import ctr = require('controller')

import koki = require('konsenskistemodel')
import ka = require('kernaussagemodel')

import TestCommunicator = require('tests/testcommunicator')

var model = new mdl.ModelImpl;
var viewModel = new vm.ViewModel;
var communicator = new TestCommunicator;
var controller = new ctr.Controller(model, viewModel, communicator);
		
var konsenskiste = new koki.Model();
model.konsenskiste(konsenskiste);

reloader.viewModel(viewModel);
reloader.model(model);
reloader.communicator(communicator);
reloader.controller(controller);

setTimeout(function() {
	var test = new unit.Test();
	
	test.addTestClass( new kokiWin.Tests() );
	
	test.run( result => test.showResults(document.getElementById('tests'), result) );
}, 1000);