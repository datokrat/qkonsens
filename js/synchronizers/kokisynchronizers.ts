import Base = require('synchronizers/childarraysynchronizer')
import Factories = require('factories/constructorbased')
import KaModel = require('../kernaussagemodel')
import KaViewModel = require('../kernaussageviewmodel')
import KaController = require('../kernaussagecontroller')
import ContentCommunicator = require('../contentcommunicator')

export class KaSynchronizer extends Base.ObservingChildArraySynchronizer<KaModel.Model, KaViewModel.ViewModel, KaController.Controller> {
	constructor(communicator: ContentCommunicator.Main) {
		super();
		this.setViewModelFactory( new Factories.Factory(KaViewModel.ViewModel) );
		this.setControllerFactory( new Factories.ControllerFactoryEx(KaController.Controller, communicator) );
	}
}