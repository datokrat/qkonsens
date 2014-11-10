import LocationHash = require('../locationhash');
import Evt = require('../event');
import KokiControllerFactory = require('factories/konsenskistecontroller');

import winVm = require('windows/konsenskiste');
import kokiMdl = require('../konsenskistemodel');
import kokiVm = require('../konsenskisteviewmodel');
import kokiCtr = require('../konsenskistecontroller');
import KokiCommunicator = require('../konsenskistecommunicator');
import ViewModelContext = require('viewmodelcontext');

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
			var kk = this.communicator.query(typedState.kokiId);
			this.setKonsenskisteModel(kk);
		}
		this.window.state.subscribe(state => {
			LocationHash.set(JSON.stringify(state), false)
		});
		this.subscriptions = this.subscriptions.concat([
			LocationHash.changed.subscribe(() => {
				this.onHashChanged()
			})
		]);
	}
	
	private onHashChanged() {
		var hash = location.hash;
		var hashObj = JSON.parse(hash.slice(1));
		if(hashObj.kokId != (this.konsenskisteModel && this.konsenskisteModel.id())) this.setKonsenskisteModelById(hashObj.kokiId);
	}
	
	private setKonsenskisteModelById(id: number) {
		this.cxt.konsenskisteModel(this.communicator.query(id));
	}
	
	private initKonsenskiste(konsenskisteModel: kokiMdl.Model) {
		this.disposeKonsenskiste();
			
		var konsenskisteViewModel = new kokiVm.ViewModel;
		this.konsenskisteModel = konsenskisteModel;
		this.konsenskisteController = this.konsenskisteControllerFactory.create(konsenskisteModel, konsenskisteViewModel, this.communicator);
		if(this.cxt) this.konsenskisteController.setViewModelContext(this.cxt);
        
		this.window.kkView(konsenskisteViewModel);
		this.window.state(<State>{ kokiId: konsenskisteModel && konsenskisteModel.id() });
	}
	
	private disposeKonsenskiste() {
		if(this.konsenskisteController)
			this.konsenskisteController.dispose();
	}
	
	public setContext(cxt: ViewModelContext) {
		this.cxt = cxt;
		this.konsenskisteController.setViewModelContext(cxt);
		return this;
	}
	
	public setKonsenskisteModel(konsenskisteModel: kokiMdl.Model) {
		this.initKonsenskiste(konsenskisteModel);
		this.setContext(this.cxt);
	}
	
	public dispose() {
		this.konsenskisteController.dispose();
		this.subscriptions.forEach(s => s.undo());
	}
	
	private cxt: ViewModelContext;
	
	private window: winVm.Win;
	private konsenskisteModel: kokiMdl.Model;
	private konsenskisteController: kokiCtr.Controller;
	private communicator: KokiCommunicator.Main;
	private konsenskisteControllerFactory = new KokiControllerFactory.Factory;
	
	private subscriptions: Evt.Subscription[] = [];
}