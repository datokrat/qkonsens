///<reference path="../typings/jquery.d.ts" />

import unit = require('tests/tsunit')
import test = require('tests/test')

import kokiWin = require('frontendtests/kokiwin')


setTimeout(function() {
	console.log('test mode');
	
	var test = new unit.Test();
	
	test.addTestClass( new kokiWin.Tests() );
	
	test.showResults(document.getElementById('tests'), test.run());
}, 4000);