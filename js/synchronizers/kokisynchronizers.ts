import Base = require('synchronizers/childarraysynchronizer')
import Factories = require('factories/constructorbased')
import KaModel = require('../kernaussagemodel')
import KaViewModel = require('../kernaussageviewmodel')
import KaController = require('../kernaussagecontroller')
import KaCommunicator = require('../kernaussagecommunicator')

export class KaSynchronizer extends Base.ObservingChildArraySynchronizer<KaModel.Model, KaViewModel.ViewModel, KaController.Controller> {
	constructor(communicator: KaCommunicator.Main) {
		super();
		this.setViewModelFactory( new Factories.Factory(KaViewModel.ViewModel) );
		this.setControllerFactory( new Factories.ControllerFactoryEx<KaModel.Model, KaViewModel.ViewModel, KaCommunicator.Main, KaController.Controller>(KaController.Controller, communicator) );
	}
}