import mdl = require('model')
import vm = require('viewmodel')
import TopicNavigationModel = require('topicnavigationmodel');
import Evt = require('event');

import frame = require('frame')
import noneWin = require('windows/none')
import NewKkWin = require('windows/newkk');
import IntroWin = require('windows/intro');
import EditKElementWin = require('windows/editkelement');

import StateLogic = require('statelogic');
import TopicLogic = require('topiclogic');
import KokiLogic = require('kokilogic');

import DiscussionWindow = require('windows/discussion')
import Discussion = require('discussion');
import Communicator = require('communicator')
import KonsenskisteModel = require('konsenskistemodel');
import Topic = require('topic');
import Commands = require('command');
import KElementCommands = require('kelementcommands');
import WindowViewModel = require('windowviewmodel');

export class Controller {
	constructor(private model: mdl.Model, private viewModel: vm.ViewModel, private communicator: Communicator.Main, commandControl?: Commands.CommandControl) {
		//var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel., { communicator: communicator.topic });
		this.initCommandControl(commandControl);
		
		this.initWindows();
		this.initWindowViewModel();
		
		this.initKokiLogic();
		this.initTopicLogic();
		this.initAccount();
		this.initStateLogic();
	}
	
	private initWindows() {
		this.newKkWin = new NewKkWin.Win();
		this.editKElementWin = new EditKElementWin.Win();
		this.introWin = new IntroWin.Win();
		
		this.viewModel.left = new frame.WinContainer( this.introWin );
		this.viewModel.right = new frame.WinContainer( new noneWin.Win() );
		this.viewModel.center = new frame.WinContainer( new noneWin.Win() );
		
		this.newKkWinController = new NewKkWin.Controller(this.newKkWin, this.commandProcessor);
		this.editKElementWinController = new EditKElementWin.Controller(this.editKElementWin, this.commandProcessor);
	}
	
	private initWindowViewModel() {
		this.windowViewModel = new WindowViewModel.Main({ center: this.viewModel.center, left: this.viewModel.left, right: this.viewModel.right });
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
		topicLogicResources.topicNavigationModel = new TopicNavigationModel.ModelImpl(); //this.model.topicNavigation;
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
	
	public dispose() {
		this.newKkWinController.dispose();
		this.stateLogic.dispose();
		this.kokiLogic.dispose();
		this.topicLogic.dispose();
		this.subscriptions.forEach(s => s.dispose());
	}
	
	private initAccount() {
		this.initializeListOfAvailableAccounts();
		
		this.viewModel.isAdmin = ko.observable<boolean>(false);
		this.model.account.subscribe(account => {
			this.updateAccountViewModel();
			this.login();
			this.commandProcessor.floodCommand(new HandleChangedAccountCommand());
		});
		
		this.viewModel.userName = ko.observable<string>();
		this.viewModel.userName.subscribe(userName => {
			if(this.model.account().userName != userName)
				this.model.account(new mdl.Account({ userName: userName }));
		});
		
		this.updateAccountViewModel();
		this.login();
	}
	
	private initializeListOfAvailableAccounts() {
		this.viewModel.availableAccounts = ko.observableArray<string>(['anonymous']);
		this.communicator.commandProcessor.processCommand(new Communicator.GetAllUsersCommand(users => {
			this.viewModel.availableAccounts(users);
		}));
	}
	
	private login() {
		this.communicator.commandProcessor.processCommand(new Communicator.LoginCommand(this.model.account().userName));
	}
	
	private updateAccountViewModel() {
		if(this.viewModel.userName() != this.model.account().userName) this.viewModel.userName(this.model.account().userName);
	}
	
	private initCommandControl(parent: Commands.CommandControl) {
		this.commandProcessor.parent = parent && parent.commandProcessor;
		this.commandProcessor.chain.append(cmd => {
			if(cmd instanceof CreateNewKokiCommand) {
				var createKokiCommand = <CreateNewKokiCommand>cmd;
				var topicId: number = !createKokiCommand.parentTopic.id.root && createKokiCommand.parentTopic.id.id;
				this.communicator.konsenskiste.create(createKokiCommand.model, topicId, id => createKokiCommand.then(id));
				return true;
			}
			if(cmd instanceof OpenNewKokiWindowCommand) {
				var openNewKokiWindowCommand = <OpenNewKokiWindowCommand>cmd;
				this.newKkWinController.setParentTopic(openNewKokiWindowCommand.topic);
				this.viewModel.left.win(this.newKkWin);
				return true;
			}
			if(cmd instanceof OpenDiscussionWindowCommand) {
				var openDiscussionWindowCommand = <OpenDiscussionWindowCommand>cmd;
				this.discussionWin.discussable((<OpenDiscussionWindowCommand>cmd).discussableViewModel);
				this.viewModel.left.win(this.discussionWin);
				return true;
			}
			if(cmd instanceof KElementCommands.OpenEditKElementWindowCommand) {
				var editKElementWindowCommand = <KElementCommands.OpenEditKElementWindowCommand>cmd;
				this.editKElementWinController.setModel(editKElementWindowCommand.model);
				this.viewModel.left.win(this.editKElementWin);
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
	
	public commandProcessor = new Commands.CommandProcessor();
	
	private windowViewModel: WindowViewModel.Main;
	private discussionWin = new DiscussionWindow.Win();
	private newKkWin: NewKkWin.Win;
	private newKkWinController: NewKkWin.Controller;
	private introWin: IntroWin.Win;
	private editKElementWin: EditKElementWin.Win;
	private editKElementWinController: EditKElementWin.Controller;
	
	private stateLogic: StateLogic.Controller;
	private kokiLogic: KokiLogic.Controller;
	private topicLogic: TopicLogic.Controller;
	
	private subscriptions: Evt.Subscription[] = [];
}

export class CreateNewKokiCommand extends Commands.Command {
	constructor(public model: KonsenskisteModel.Model, public parentTopic: Topic.Model, public then: (id: number) => void) { super() }
}

export class OpenNewKokiWindowCommand extends Commands.Command {
	constructor(public topic: Topic.Model) { super() }
}

export class HandleChangedAccountCommand extends Commands.Command {
	public toString = () => 'HandleChangedAccountCommand';
}

export class OpenDiscussionWindowCommand extends Commands.Command {
	constructor(public discussableViewModel: Discussion.DiscussableViewModel) { super() }
}