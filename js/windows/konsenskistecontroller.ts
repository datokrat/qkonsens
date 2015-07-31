import LocationHash = require('../locationhash');
import Evt = require('../event');
import KokiControllerFactory = require('factories/konsenskistecontroller');

import winVm = require('windows/konsenskiste');
import kokiMdl = require('../konsenskistemodel');
import kokiVm = require('../konsenskisteviewmodel');
import kokiCtr = require('../konsenskistecontroller');
import KokiCommunicator = require('../konsenskistecommunicator');
import ViewModelContext = require('viewmodelcontext');
import Commands = require('../command');
import KokiLogic = require('../kokilogic');

export interface State {
	kokiId: number;
}

export interface Controller {
	setKonsenskisteModel(model: kokiMdl.Model): void;
	dispose(): void;
}

export class ControllerImpl implements Controller {
	constructor(konsenskisteModel: kokiMdl.Model, windowViewModel: winVm.Win, private args: {communicator: KokiCommunicator.Main; commandProcessor: Commands.CommandProcessor}) {
		this.initWindow(windowViewModel);
		this.communicator = args.communicator;
		this.initKonsenskiste(konsenskisteModel);
	}
	
	private initWindow(win: winVm.Win) {
		this.window = win;
		this.window.kkView = ko.observable<kokiVm.ViewModel>();
		this.window.setState = (state: any) => {
			if(state) {
				var typedState = <State>state;
				var koki = new kokiMdl.Model(); koki.id(typedState.kokiId);
				this.args.commandProcessor.processCommand(new KokiLogic.SelectAndLoadKokiCommand(koki.id()));
			}
		}
		this.window.state.subscribe(state => this.args.commandProcessor.floodCommand
			(new KokiLogic.HandleChangedKokiWinStateCommand(state)));
	}
	
	private initKonsenskiste(konsenskisteModel: kokiMdl.Model) {
		this.disposeKonsenskiste();
			
		var konsenskisteViewModel = new kokiVm.ViewModel;
		this.konsenskisteModel = konsenskisteModel;
		this.konsenskisteController = this.konsenskisteControllerFactory.create
			(konsenskisteModel, konsenskisteViewModel, this.args);
        
		this.window.kkView(konsenskisteViewModel);
		if(konsenskisteModel)
			this.window.state(<State>{ kokiId: konsenskisteModel && konsenskisteModel.id() });
		else
			this.window.state(null);
	}
	
	private disposeKonsenskiste() {
		if(this.konsenskisteController)
			this.konsenskisteController.dispose();
	}
	
	public setKonsenskisteModel(konsenskisteModel: kokiMdl.Model) {
		this.initKonsenskiste(konsenskisteModel);
	}
	
	public dispose() {
		this.konsenskisteController.dispose();
		this.subscriptions.forEach(s => s.dispose());
	}
	
	private window: winVm.Win;
	private konsenskisteModel: kokiMdl.Model;
	private konsenskisteController: kokiCtr.Controller;
	private communicator: KokiCommunicator.Main;
	private konsenskisteControllerFactory = new KokiControllerFactory.Factory;
	
	private subscriptions: Evt.Subscription[] = [];
}