import KokiControllerFactory = require('factories/konsenskistecontroller')

import winVm = require('windows/konsenskiste')
import kokiMdl = require('../konsenskistemodel')
import kokiVm = require('../konsenskisteviewmodel')
import kokiCtr = require('../konsenskistecontroller')
import KokiCommunicator = require('../konsenskistecommunicator')
import ViewModelContext = require('viewmodelcontext')

export interface State {
	kokiId: number;
}

export class Controller {
		constructor(konsenskisteModel: kokiMdl.Model, windowViewModel: winVm.Win, communicator: KokiCommunicator.Main) {
		this.initWindow(windowViewModel);
		this.communicator = communicator;
		this.window.kkView = ko.observable<kokiVm.ViewModel>();
		this.initKonsenskiste(konsenskisteModel);
	}
	
	private initWindow(win: winVm.Win) {
		this.window = win;
		this.window.setState = (state: any) => {
			var typedState = <State>state;
			var kk = this.communicator.queryKoki(typedState.kokiId);
			this.setKonsenskisteModel(kk);
		}
	}
	
	private initKonsenskiste(konsenskisteModel: kokiMdl.Model) {
		this.disposeKonsenskiste();
			
		var konsenskisteViewModel = new kokiVm.ViewModel;
		this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel, this.communicator);
		if(this.cxt) this.konsenskisteController.setContext(this.cxt);
        
		this.window.kkView(konsenskisteViewModel);
		this.window.state(<State>{ kokiId: konsenskisteModel && konsenskisteModel.id() });
		console.log('state = ', this.window.state());
	}
	
	private disposeKonsenskiste() {
		if(this.konsenskisteController)
			this.konsenskisteController.dispose();
	}
	
	public setContext(cxt: ViewModelContext) {
		this.cxt = cxt;
		this.konsenskisteController.setContext(cxt);
		return this;
	}
	
	public setKonsenskisteModel(konsenskisteModel: kokiMdl.Model) {
		this.initKonsenskiste(konsenskisteModel);
		this.setContext(this.cxt);
	}
	
	public dispose() {
		this.konsenskisteController.dispose();
	}
	
	private cxt: ViewModelContext;
	
	private window: winVm.Win;
	private konsenskisteController: kokiCtr.Controller;
	private communicator: KokiCommunicator.Main;
	private konsenskisteControllerFactory = new KokiControllerFactory.Factory;
}