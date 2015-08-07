import Commands = require('command');
import Memory = require('memory');

import MainController = require('controller');
import KonsenskisteModel = require('konsenskistemodel');
import KonsenskisteCommunicator = require('konsenskistecommunicator');

import KonsenskisteWin = require('windows/konsenskiste');
import KonsenskisteWinController = require('windows/konsenskistecontroller');
import NewKkWin = require('windows/newkk');
import Windows = require('windows');

import StateLogic = require('statelogic');
import AccountLogic = require('accountlogic');

export class Controller {
	constructor(private resources: Resources) {
		this.initCommandProcessors();
		this.initKonsenskisteModel();
		this.initKonsenskisteWin();
	}
	
	public dispose() {
		this.konsenskisteWinController.dispose();
		this.disposableContainer.dispose();
	}
	
	private initCommandProcessors() {
		this.commandProcessor = new Commands.CommandProcessor();
		this.commandProcessor.chain.append(cmd => {
			if(cmd instanceof SelectAndLoadKokiCommand) return this.onSelectAndLoadKokiCommandReceived(<SelectAndLoadKokiCommand>cmd);
			if(cmd instanceof SetKokiCommand) return this.onSetKokiCommandReceived(<SetKokiCommand>cmd);
			if(cmd instanceof AccountLogic.HandleChangedAccountCommand) return this.onHandleChangedAccountCommandReceived(<AccountLogic.HandleChangedAccountCommand>cmd);
			if(cmd instanceof StateLogic.ChangeKokiStateCommand) return this.onChangeKokiStateCommandReceived(<StateLogic.ChangeKokiStateCommand>cmd);
		});
		
		this.internalCommandProcessor = new Commands.CommandProcessor();
		this.internalCommandProcessor.parent = this.resources.commandProcessor;
		this.internalCommandProcessor.chain.append(cmd => {
			if(cmd instanceof HandleChangedKokiWinStateCommand) 
				return this.onHandleChangedKokiWinStateCommandReceived(<HandleChangedKokiWinStateCommand>cmd);
		});
		
		this.disposableContainer.append(
			this.resources.commandProcessor.chain.append((cmd, mode) => {
				return this.commandProcessor.chain.runOrFlood(cmd, mode);
			})
		);
	}
	
	private initKonsenskisteModel() {
		this.konsenskisteModel.subscribe(kokiModel => this.onKonsenskisteModelChanged(kokiModel));
	}
	
	private initKonsenskisteWin() {
		this.konsenskisteWin = new KonsenskisteWin.Win();
		this.konsenskisteWinController = this.createKonsenskisteWinController();
		
		this.resources.windowViewModel.fillFrameWithWindow(Windows.Frame.Center, this.konsenskisteWin);
	}
	
	private onSelectAndLoadKokiCommandReceived(cmd: SelectAndLoadKokiCommand): boolean {
		this.selectAndLoadKoki(cmd.id);
		return true;
	}
	
	private onSetKokiCommandReceived(cmd: SetKokiCommand): boolean {
		this.setKoki(cmd.model);
		return true;
	}
	
	private onHandleChangedAccountCommandReceived(cmd: AccountLogic.HandleChangedAccountCommand) {
		if(this.konsenskisteModel()) {
			this.selectAndLoadKoki(this.konsenskisteModel().id());
		}
		return true;
	}
	
	private onHandleChangedKokiWinStateCommandReceived(cmd: HandleChangedKokiWinStateCommand): boolean {
		this.resources.commandProcessor.floodCommand(cmd);
		return true;
	}
	
	private onChangeKokiStateCommandReceived(cmd: StateLogic.ChangeKokiStateCommand): boolean {
		this.selectAndLoadKoki(cmd.state.kokiId);
		return true;
	}
	
	private selectAndLoadKoki(id: number) {
		this.setKoki(this.resources.konsenskisteCommunicator.query(id));
	}
	
	private setKoki(koki: KonsenskisteModel.Model) {
		this.konsenskisteModel(koki);
	}
	
	private onKonsenskisteModelChanged(kokiModel) {
		this.konsenskisteWinController.setKonsenskisteModel(kokiModel);
	}
	
	private createKonsenskisteWinController(): KonsenskisteWinController.Controller {
		if(this.resources.konsenskisteWinControllerFactory)
			return this.resources.konsenskisteWinControllerFactory.create
			(this.konsenskisteModel(), this.konsenskisteWin,
			{communicator: this.resources.konsenskisteCommunicator, commandProcessor: this.internalCommandProcessor});
		else
			return new KonsenskisteWinController.ControllerImpl
			(this.konsenskisteModel(), this.konsenskisteWin, 
			{communicator: this.resources.konsenskisteCommunicator, commandProcessor: this.internalCommandProcessor});
	}
	
	public commandProcessor: Commands.CommandProcessor;
	private internalCommandProcessor: Commands.CommandProcessor;
	
	private konsenskisteModel = ko.observable<KonsenskisteModel.Model>();
	private konsenskisteWin: KonsenskisteWin.Win;
	private konsenskisteWinController: KonsenskisteWinController.Controller;
	
	private disposableContainer: Memory.DisposableContainer = new Memory.DisposableContainer();
}

export class Resources {
	public commandProcessor: Commands.CommandProcessor;
	public windowViewModel: Windows.WindowViewModel;
	public konsenskisteCommunicator: KonsenskisteCommunicator.Main;
	public konsenskisteWinControllerFactory: KonsenskisteWinControllerFactory;
}
	
export interface KonsenskisteWinControllerFactory {
	create(model: KonsenskisteModel.Model, win: KonsenskisteWin.Win, args: { communicator: KonsenskisteCommunicator.Main; commandProcessor: Commands.CommandProcessor })
		: KonsenskisteWinController.Controller;
}

export class SelectAndLoadKokiCommand extends Commands.Command {
	constructor(public id: number) { super() }
}

export class SetKokiCommand extends Commands.Command {
	constructor(public model: KonsenskisteModel.Model) { super() }
}

export class HandleChangedKokiWinStateCommand extends Commands.Command {
	constructor(public state: KonsenskisteWinController.State) { super() }
}