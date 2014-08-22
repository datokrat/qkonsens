import KokiControllerFactory = require('factories/konsenskistecontroller')

import winVm = require('windows/konsenskiste')
import kokiMdl = require('../konsenskistemodel')
import kokiVm = require('../konsenskisteviewmodel')
import kokiCtr = require('../konsenskistecontroller')

export class Controller {
		constructor(konsenskisteModel: kokiMdl.Model, windowViewModel: winVm.Win) {
		this.window = windowViewModel;
		this.window.kkView = ko.observable<kokiVm.ViewModel>();
		this.initKonsenskiste(konsenskisteModel);
	}
	
	private initKonsenskiste(konsenskisteModel: kokiMdl.Model) {
		if(this.konsenskisteController)
			this.konsenskisteController.dispose();
			
		var konsenskisteViewModel = new kokiVm.ViewModel;
		this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel);
		
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
	private konsenskisteControllerFactory = new KokiControllerFactory.Factory;
}