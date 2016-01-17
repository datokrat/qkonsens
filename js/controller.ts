import mdl = require('model')
import vm = require('viewmodel')
import TopicNavigationModel = require('topicnavigationmodel');
import Evt = require('event');

import Memory = require('memory');
import frame = require('frame')
import noneWin = require('windows/none')

import StateLogic = require('statelogic');
import TopicLogic = require('topiclogic');
import KokiLogic = require('kokilogic');
import AccountLogic = require('accountlogic');
import Account = require('account');

import Discussion = require('discussion');
import Communicator = require('communicator')
import Topic = require('topic');
import Commands = require('command');
import KElementCommands = require('kelementcommands');
import Windows = require('windows'); //TODO Rename

export class Controller {
	constructor(private model: mdl.Model, private viewModel: vm.ViewModel, private communicator: Communicator.Main) {
		this.initCommandControl(communicator);
		
		this.initWindows();
		this.initWindowViewModel();
		
		this.initWindowLogic();
		this.initKokiLogic();
		this.initTopicLogic();
		this.initAccountLogic();
		this.initStateLogic();
	}
	
	private initCommandControl(parent: Commands.CommandControl) {
		this.commandProcessor.parent = parent && parent.commandProcessor;
		this.commandProcessor.chain.append(cmd => {
			if(cmd instanceof CreateNewKokiCommand) {
				var createKokiCommand = <CreateNewKokiCommand>cmd;
				var topicId: number = !createKokiCommand.parentTopicId.root && createKokiCommand.parentTopicId.id;
				this.communicator.konsenskiste.create(createKokiCommand.data, topicId, id => createKokiCommand.then(id));
				return true;
			}
			if(cmd instanceof KElementCommands.UpdateGeneralContentCommand) {
				var updateGeneralContentCommand = <KElementCommands.UpdateGeneralContentCommand>cmd;
				this.communicator.konsenskiste.content.updateGeneral(updateGeneralContentCommand.content, { then: () => {
					updateGeneralContentCommand.callbacks.then();
				}});
				return true;
			}
			if(cmd instanceof KElementCommands.UpdateContextCommand) {
				var updateContextCommand = <KElementCommands.UpdateContextCommand>cmd;
				this.communicator.konsenskiste.content.updateContext(updateContextCommand.content, { then: () => {
					updateContextCommand.callbacks.then();
				}, error: () => {}});
				return true;
			}
			return false;
		});
	}
	
	private initWindows() {
		this.windows = new Windows.Windows(this.commandProcessor);
		
		this.viewModel.left = new frame.WinContainer( this.windows.introFrame );
		this.viewModel.right = new frame.WinContainer( new noneWin.Win() );
		this.viewModel.center = new frame.WinContainer( new noneWin.Win() );
	}
	
	private initWindowViewModel() {
		this.windowViewModel = new Windows.WindowViewModel({ center: this.viewModel.center, left: this.viewModel.left, right: this.viewModel.right });
	}
	
	private initWindowLogic() {
		this.windowLogic = new Windows.WindowLogic(this.windowViewModel, this.windows, this.commandProcessor);
	}
	
	private initKokiLogic() {
		var kokiLogicResources = new KokiLogic.Resources();
		kokiLogicResources.windowViewModel = this.windowViewModel;
		kokiLogicResources.konsenskisteCommunicator = this.communicator.konsenskiste;
		kokiLogicResources.commandProcessor = this.commandProcessor;
		
		this.kokiLogic = new KokiLogic.Controller(kokiLogicResources);
	}
	
	private initTopicLogic() {
		var topicLogicResources = new TopicLogic.Resources();
		topicLogicResources.topicNavigationModel = new TopicNavigationModel.ModelImpl();
		topicLogicResources.topicCommunicator = this.communicator.topic;
		topicLogicResources.windowViewModel = this.windowViewModel;
		topicLogicResources.commandProcessor = this.commandProcessor;
		
		this.topicLogic = new TopicLogic.Controller(topicLogicResources);
	}
	
	private initStateLogic() {
		var resources = new StateLogic.Resources();
		resources.commandProcessor = this.commandProcessor;
		this.stateLogic = new StateLogic.Controller(resources);
		
		this.stateLogic.initialize();
	}
	
	private initAccountLogic() {
		this.viewModel.account = new Account.ViewModel();
		this.accountLogic = new AccountLogic.Controller(this.model.account, this.viewModel.account, this.commandProcessor);
	}
	
	public dispose() {
		this.windows.dispose();
		this.windowLogic.dispose();
		this.stateLogic.dispose();
		this.kokiLogic.dispose();
		this.topicLogic.dispose();
		this.subscriptions.forEach(s => s.dispose());
	}
	
	public commandProcessor = new Commands.CommandProcessor();
	
	private windowViewModel: Windows.WindowViewModel;
	private windows: Windows.Windows;
	
	private windowLogic: Windows.WindowLogic;
	private stateLogic: StateLogic.Controller;
	private kokiLogic: KokiLogic.Controller;
	private topicLogic: TopicLogic.Controller;
	private accountLogic: AccountLogic.Controller;
	
	private subscriptions: Evt.Subscription[] = [];
}

export class CreateNewKokiCommand extends Commands.Command {
	constructor(public data: { title: string; text: string; }, public parentTopicId: Topic.TopicIdentifier, public then: (id: number) => void) { super() }
}