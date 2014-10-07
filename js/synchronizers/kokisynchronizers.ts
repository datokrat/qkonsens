import Base = require('synchronizers/childarraysynchronizer')
import Factories = require('factories/constructorbased')
import KaModel = require('../kernaussagemodel')
import KaViewModel = require('../kernaussageviewmodel')
import KaController = require('../kernaussagecontroller')
import KaCommunicator = require('../kernaussagecommunicator')
import ViewModelContext = require('../viewmodelcontext')

export class KaSynchronizer extends Base.ObservingChildArraySynchronizer<KaModel.Model, KaViewModel.ViewModel, KaController.Controller> {
	constructor(communicator: KaCommunicator.Main) {
		super();
		this.controllerFactory2 = new ControllerFactory().setCommunicator(communicator);
		this.setViewModelFactory( new Factories.Factory(KaViewModel.ViewModel) );
		this.setControllerFactory(this.controllerFactory2);
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.controllerFactory2.setViewModelContext(cxt);
		this.forEachController(ctr => ctr.setViewModelContext(cxt));
	}
	
	private controllerFactory2: ControllerFactory;
}

class ControllerFactory {
	public create(model: KaModel.Model, viewModel: KaViewModel.ViewModel): KaController.Controller {
		var controller = new KaController.Controller(model, viewModel, this.communicator);
		if(this.viewModelContext) controller.setViewModelContext(this.viewModelContext);
		return controller;
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.viewModelContext = cxt;
		return this;
	}
	
	public setCommunicator(com: KaCommunicator.Main) {
		this.communicator = com;
		return this;
	}
	
	private viewModelContext: ViewModelContext;
	private communicator: KaCommunicator.Main;
}