import mdl = require('model')
import vm = require('viewmodel')
import topicNavigationCtr = require('topicnavigationcontroller')
import LocationHash = require('locationhash');
import Evt = require('event');

import frame = require('frame')
import noneWin = require('windows/none')
import KokiWin = require('windows/konsenskiste');
import BrowseWin = require('windows/browse');
import NewKkWin = require('windows/newkk');

import TopicLogic = require('topiclogic');

import DiscussionWindow = require('windows/discussion')
import kokiWinCtr = require('windows/konsenskistecontroller')
import KokiControllerFactory = require('factories/konsenskistecontroller')
import Communicator = require('communicator')
import KokiCommunicator = require('konsenskistecommunicator');
import KonsenskisteModel = require('konsenskistemodel');
import ViewModelContext = require('viewmodelcontext')
import Topic = require('topic');
import Commands = require('command');
import WindowViewModel = require('windowviewmodel');

export class Controller {
	constructor(private model: mdl.Model, private viewModel: vm.ViewModel, private communicator: Communicator.Main, commandControl?: Commands.CommandControl) {
		//var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel., { communicator: communicator.topic });
		this.initCommandControl(commandControl);
		
		this.initWindows();
		
		this.initTopicNavigation();
		this.initAccount();
		this.initState();
	}
	
	private initWindows() {
		this.kkWin = new KokiWin.Win();
		//this.browseWin = new BrowseWin.Win();
		this.newKkWin = new NewKkWin.Win();
		
		this.viewModel.left = new frame.WinContainer( new noneWin.Win() );
		this.viewModel.right = new frame.WinContainer( new noneWin.Win() );
		this.viewModel.center = new frame.WinContainer( this.kkWin );
		//this.viewModel.browseWin = this.browseWin;
		this.viewModel.kkWin = this.kkWin;
		
		var globalContext = new ViewModelContext(this.viewModel.left, this.viewModel.right, this.viewModel.center);
		globalContext.konsenskisteWindow = this.kkWin;
		globalContext.discussionWindow = new DiscussionWindow.Win();
		globalContext.konsenskisteModel = this.model.konsenskiste;
		
		this.kkWinController = new kokiWinCtr.Controller(this.model.konsenskiste(), this.kkWin, this.communicator.konsenskiste)
			.setContext(globalContext);
		
		//this.browseWinController = new BrowseWin.Controller(this.model.topicNavigation, this.browseWin, this.communicator.topic, this.commandControl);
		this.newKkWinController = new NewKkWin.Controller(this.newKkWin, this.commandControl.commandProcessor);
		
		this.model.konsenskiste.subscribe( newKoki => this.kkWinController.setKonsenskisteModel(newKoki) );
	}
	
	private initTopicNavigation() {
		var topicLogicResources = new TopicLogic.Resources();
		topicLogicResources.topicNavigationModel = this.model.topicNavigation;
		topicLogicResources.topicCommunicator = this.communicator.topic;
		topicLogicResources.windowViewModel = new WindowViewModel.Main({ center: this.viewModel.center, left: this.viewModel.left, right: this.viewModel.right });
		topicLogicResources.commandProcessor = this.commandControl.commandProcessor;
		
		this.topicLogic = new TopicLogic.Controller(topicLogicResources);
	}
	
	private initState() {
		this.kkWin.state.subscribe(state => LocationHash.set(JSON.stringify(state), false));
		this.subscriptions = [ LocationHash.changed.subscribe(() => this.onHashChanged()) ];
		this.onHashChanged();
	}
	
	public dispose() {
		this.kkWinController.dispose();
		//this.browseWinController.dispose();
		this.newKkWinController.dispose();
		this.topicLogic.dispose();
		this.subscriptions.forEach(s => s.dispose());
	}
	
	private initAccount() {
		this.model.account.subscribe(account => {
			this.updateAccountViewModel();
			this.login();
			this.reloadKk();
		});
		
		this.viewModel.userName = ko.observable<string>();
		this.viewModel.userName.subscribe(userName => {
			if(this.model.account().userName != userName)
				this.model.account(new mdl.Account({ userName: userName }));
		});
		
		this.updateAccountViewModel();
		this.login();
	}
	
	private reloadKk() {
		this.model.konsenskiste(this.communicator.konsenskiste.query(this.model.konsenskiste().id()));
	}
	
	private login() {
		this.communicator.commandProcessor.processCommand(new Communicator.LoginCommand(this.model.account().userName));
	}
	
	private updateAccountViewModel() {
		if(this.viewModel.userName() != this.model.account().userName) this.viewModel.userName(this.model.account().userName);
	}
	
	private initCommandControl(parent: Commands.CommandControl) {
		this.commandControl.commandProcessor.parent = parent && parent.commandProcessor;
		this.commandControl.commandProcessor.chain.append(cmd => {
			if(cmd instanceof SelectKokiCommand) {
				this.kkWinController.setKonsenskisteModelById((<SelectKokiCommand>cmd).model.id());
				return true;
			}
			else if(cmd instanceof CreateNewKokiCommand) {
				var createKokiCommand = <CreateNewKokiCommand>cmd;
				var topicId: number = !createKokiCommand.parentTopic.id.root && createKokiCommand.parentTopic.id.id;
				this.communicator.konsenskiste.create(createKokiCommand.model, topicId, id => createKokiCommand.then(id));
				return true;
			}
			else if(cmd instanceof OpenNewKokiWindowCommand) {
				var openNewKokiWindowCommand = <OpenNewKokiWindowCommand>cmd;
				this.newKkWinController.setParentTopic(openNewKokiWindowCommand.topic);
				this.viewModel.left.win(this.newKkWin);
				return true;
			}
			return false;
		});
	}
	
	private onHashChanged() {
		var hash = LocationHash.get().slice(1);
		try {
			var hashObj = JSON.parse(hash);
			this.kkWin.setState(hashObj || { kokiId: 12 });
		}
		catch(e) {
			this.kkWin.setState({ kokiId: 12 });
		}
	}
	
	public commandControl: Commands.CommandControl = { commandProcessor: new Commands.CommandProcessor() };
	
	private kkWin: KokiWin.Win;
	private kkWinController: kokiWinCtr.Controller;
	//private browseWin: BrowseWin.Win;
	//private browseWinController: BrowseWin.Controller;
	private newKkWin: NewKkWin.Win;
	private newKkWinController: NewKkWin.Controller;
	
	private topicLogic: TopicLogic.Controller;
	
	private subscriptions: Evt.Subscription[] = [];
}

export class SelectKokiCommand extends Commands.Command {
	constructor(public model: KonsenskisteModel.Model) { super() }
}

export class CreateNewKokiCommand extends Commands.Command {
	constructor(public model: KonsenskisteModel.Model, public parentTopic: Topic.Model, public then: (id: number) => void) { super() }
}

export class OpenNewKokiWindowCommand extends Commands.Command {
	constructor(public topic: Topic.Model) { super() }
}