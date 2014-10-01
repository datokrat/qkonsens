import mdl = require('../konsenskistemodel')
import vm = require('../konsenskisteviewmodel')
import ctr = require('../konsenskistecontroller')
import KokiCommunicator = require('../konsenskistecommunicator')

export class Factory {
	public create(model: mdl.Model, viewModel: vm.ViewModel, communicator: KokiCommunicator.Main): ctr.Controller {
		if(model)
			return new ctr.ControllerImpl(model, viewModel, communicator);
		else
			return new NullController();
	}
}

class NullController implements ctr.Controller {
	dispose() {}
}