import mdl = require('../konsenskistemodel')
import vm = require('../konsenskisteviewmodel')
import ctr = require('../konsenskistecontroller')
import Communicator = require('../communicator')

export class Factory {
	public create(model: mdl.Model, viewModel: vm.ViewModel, communicator: Communicator.Main): ctr.Controller {
		if(model)
			return new ctr.ControllerImpl(model, viewModel, communicator);
		else
			return new ctr.NullController(viewModel);
	}
}