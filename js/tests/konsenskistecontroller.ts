import unit = require('tests/tsunit')
import test = require('tests/test')

import kkModelFty = require('factories/konsenskistemodel')
import kaModelFty = require('factories/kernaussagemodel')

import mdl = require('../konsenskistemodel')
import vm = require('../konsenskisteviewmodel')
import ctr = require('../konsenskistecontroller')

export class Tests extends unit.TestClass {
	private kkModelFactory = new kkModelFty.Factory();
	private kaModelFactory = new kaModelFty.Factory();

	testChildKas() {
		var model = this.kkModelFactory.create( 'Basisdemokratie (Konzept)' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		
		model.appendKa( this.kaModelFactory.create('Begriff Basisdemokratie') );
		
		test.assert(() => viewModel.childKas()[0].title() == 'Begriff Basisdemokratie');
		test.assert(() => viewModel.childKas().length == 1);
		test.assert(() => !viewModel.childKas()[0].isActive());
	}
	
	testRemoveChildKa() {
		var model = this.kkModelFactory.create( 'Basisdemokratie (Konzept)' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		var ka = this.kaModelFactory.create('Begriff Basisdemokratie');
		
		model.appendKa( this.kaModelFactory.create('Begriff Basisdemokratie') );
		model.removeKa( this.kaModelFactory.create('Begriff Basisdemokratie') );
		
		test.assert(() => viewModel.childKas().length == 0);
	}
}