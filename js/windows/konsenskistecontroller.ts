import KokiControllerFactory = require('factories/konsenskistecontroller')

import winVm = require('windows/konsenskiste')
import kokiMdl = require('../konsenskistemodel')
import kokiVm = require('../konsenskisteviewmodel')
import kokiCtr = require('../konsenskistecontroller')
import Communicator = require('../communicator')

export class Controller {
		constructor(konsenskisteModel: kokiMdl.Model, windowViewModel: winVm.Win, communicator: Communicator.Main) {
		this.window = windowViewModel;
		this.communicator = communicator;
		this.window.kkView = ko.observable<kokiVm.ViewModel>();
		this.initKonsenskiste(konsenskisteModel);
	}
	
	private initKonsenskiste(konsenskisteModel: kokiMdl.Model) {
		if(this.konsenskisteController)
			this.konsenskisteController.dispose();
			
		var konsenskisteViewModel = new kokiVm.ViewModel;
		this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel, this.communicator);
		
		this.window.kkView(konsenskisteViewModel);
	}
	
	public setKonsenskisteModel(konsenskisteModel: kokiMdl.Model) {
		this.initKonsenskiste(konsenskisteModel);
	}
	
	public dispose() {
		this.konsenskisteController.dispose();
	}
	
	private window: winVm.Win;
	private konsenskisteController: kokiCtr.Controller;
	private communicator: Communicator.Main;
	private konsenskisteControllerFactory = new KokiControllerFactory.Factory;
}