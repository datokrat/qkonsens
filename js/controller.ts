import mdl = require('model')
import vm = require('viewmodel')
import TopicNavigationModel = require('topicnavigationmodel');
import Evt = require('event');

import Memory = require('memory');
import frame = require('frame')
import noneWin = require('windows/none')
import NewKkWin = require('windows/newkk');
import IntroWin = require('windows/intro');
import EditKElementWin = require('windows/editkelement');

import StateLogic = require('statelogic');
import TopicLogic = require('topiclogic');
import KokiLogic = require('kokilogic');
import AccountLogic = require('accountlogic');
import Account = require('account');

import DiscussionWindow = require('windows/discussion')
import EnvironsWindows = require('windows/environs');
import Discussion = require('discussion');
import Communicator = require('communicator')
import Topic = require('topic');
import Commands = require('command');
import KElementCommands = require('kelementcommands');
import WindowViewModel = require('windowviewmodel'); //TODO Rename

export class WindowLogic {
	constructor(private windowViewModel: WindowViewModel.Main, private windows: Windows, private commandProcessor: Commands.CommandProcessor) {
		this.initCommandProcessor();
	}
	
	private initCommandProcessor() {
		this.disposables.append(
			this.commandProcessor.chain.append(cmd => {
				if(cmd instanceof OpenNewKokiWindowCommand) {
					var openNewKokiWindowCommand = <OpenNewKokiWindowCommand>cmd;
					this.windows.newKkWindow.model.setParentTopic(openNewKokiWindowCommand.topic);
					this.windowViewModel.fillFrameWithWindow(WindowViewModel.Frame.Left, this.windows.newKkWindow.frame);
					return true;
				}
				if(cmd instanceof KElementCommands.OpenEditKElementWindowCommand) {
					var editKElementWindowCommand = <KElementCommands.OpenEditKElementWindowCommand>cmd;
					this.windows.editKElementWindow.model.setKElementModel(editKElementWindowCommand.model);
					this.windowViewModel.fillFrameWithWindow(WindowViewModel.Frame.Left, this.windows.editKElementWindow.frame);
					return true;
				}
			})
		);
	}
	
	public dispose() {
		this.disposables.dispose();
	}
	
	private disposables = new Memory.DisposableContainer();
}

export class Controller {
	constructor(private model: mdl.Model, private viewModel: vm.ViewModel, private communicator: Communicator.Main) {
		
		//var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel., { communicator: communicator.topic });
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
			if(cmd instanceof OpenDiscussionWindowCommand) {
				var openDiscussionWindowCommand = <OpenDiscussionWindowCommand>cmd;
				this.discussionWin.discussable((<OpenDiscussionWindowCommand>cmd).discussableViewModel);
				this.viewModel.left.win(this.discussionWin);
				return true;
			}
			if(cmd instanceof OpenEnvironsWindowCommand) {
				this.viewModel.left.win(new EnvironsWindows.Win());
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
		this.windows = new Windows(this.commandProcessor);
		this.introWin = new IntroWin.Win();
		
		this.viewModel.left = new frame.WinContainer( this.introWin );
		this.viewModel.right = new frame.WinContainer( new noneWin.Win() );
		this.viewModel.center = new frame.WinContainer( new noneWin.Win() );
	}
	
	private initWindowViewModel() {
		this.windowViewModel = new WindowViewModel.Main({ center: this.viewModel.center, left: this.viewModel.left, right: this.viewModel.right });
	}
	
	private initWindowLogic() {
		this.windowLogic = new WindowLogic(this.windowViewModel, this.windows, this.commandProcessor);
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
	
	private windowViewModel: WindowViewModel.Main;
	private discussionWin = new DiscussionWindow.Win();
	private introWin: IntroWin.Win;
	private windows: Windows;
	
	private windowLogic: WindowLogic;
	private stateLogic: StateLogic.Controller;
	private kokiLogic: KokiLogic.Controller;
	private topicLogic: TopicLogic.Controller;
	private accountLogic: AccountLogic.Controller;
	
	private subscriptions: Evt.Subscription[] = [];
}

export class Windows {
	public newKkWindow: NewKkWin.Main;
	public editKElementWindow: EditKElementWin.Main;
	
	constructor(commandProcessor: Commands.CommandProcessor) {
		this.newKkWindow = NewKkWin.Main.CreateEmpty(commandProcessor);
		this.editKElementWindow = EditKElementWin.Main.CreateEmpty(commandProcessor);
	}
	
	public dispose() {
		this.newKkWindow.dispose();
		this.editKElementWindow.dispose();
	}
}

export class CreateNewKokiCommand extends Commands.Command {
	constructor(public data: { title: string; text: string; }, public parentTopicId: Topic.TopicIdentifier, public then: (id: number) => void) { super() }
}

export class OpenNewKokiWindowCommand extends Commands.Command {
	constructor(public topic: Topic.Model) { super() }
}

export class OpenDiscussionWindowCommand extends Commands.Command {
	constructor(public discussableViewModel: Discussion.DiscussableViewModel) { super() }
}

export class OpenEnvironsWindowCommand extends Commands.Command {
	constructor() { super() }
}