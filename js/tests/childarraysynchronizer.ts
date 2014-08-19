import unit = require('tests/tsunit')
import test = require('tests/test')

import synchronizer = require('../childarraysynchronizer')

export class Tests extends unit.TestClass {
	private synchronizerFactory = new SynchronizerFactory();

	test() {	
		var sync = this.synchronizerFactory.create();
		var model = new Model();
		var insertionCtr: number = 0;
		var removalCtr: number = 0;
		
		sync.setViewModelInsertionHandler(viewModel => {
			test.assert(() => viewModel.mdl == model);
			insertionCtr++;
		})
		sync.setViewModelRemovalHandler(viewModel => {
			test.assert(() => viewModel.mdl == model);
			removalCtr++;
		})
		
		sync.inserted(model);
		test.assert(() => insertionCtr == 1 && removalCtr == 0);
		sync.removed(model);
		test.assert(() => insertionCtr == 1 && removalCtr == 1);
	}
	
	testRemovalOfNonExistentModel() {
		var sync = this.synchronizerFactory.create();
		sync.setViewModelInsertionHandler(viewModel => test.assert(() => !"inserted") );
		sync.setViewModelRemovalHandler(viewModel => test.assert(() => !"removed") );
		
		var model = new Model();
		sync.removed(model);
		
		test.assert(() => model.vm == null);
	}
	
	testDoubleRegistering() {
		var sync = this.synchronizerFactory.create();
		sync.setViewModelInsertionHandler(() => {});
		sync.setViewModelRemovalHandler(() => {});
		var model = new Model();
		
		test.assertThrows(() => {
			sync.inserted(model);
			sync.inserted(model);
		});
	}
	
	testWithoutHandlers() {
		var sync = this.synchronizerFactory.create();
		sync.setViewModelInsertionHandler(null);
		sync.setViewModelRemovalHandler(null);
		var model = new Model();
		
		sync.inserted(model);
		sync.removed(model);
	}
}

class SynchronizerFactory {
	public create() {
		var sync = new synchronizer.ChildArraySynchronizer<Model, ViewModel, Controller>();
		var insertionCtr: number = 0;
		var removalCtr: number = 0;
		
		sync.setViewModelFactory({ create: () => new ViewModel() });
		sync.setControllerFactory({ create: (model: Model, viewModel: ViewModel) => new Controller(model, viewModel) });
		
		return sync;
	}
}

class Model {
	public vm: ViewModel;
}

class ViewModel {
	public mdl: Model;
}

class Controller {
	private args;
	constructor(model: Model, viewModel: ViewModel) {
		this.args = arguments;
		model.vm = viewModel;
		viewModel.mdl = model;
	}
	
	public dispose() {
		this.args[0].vm = null;
		this.args[1].mdl = null;
	}
}