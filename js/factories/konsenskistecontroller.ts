import mdl = require('../konsenskistemodel')
import vm = require('../konsenskisteviewmodel')
import ctr = require('../konsenskistecontroller')

export class Factory {
	public create(model: mdl.Model, viewModel: vm.ViewModel): ctr.Controller {
		if(model)
			return new ctr.ControllerImpl(model, viewModel);
		else
			return new ctr.NullController(viewModel);
	}
}