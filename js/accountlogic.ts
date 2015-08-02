import mdl = require('model');
import vm = require('viewmodel');
import ctr = require('controller');
import Communicator = require('communicator');
import Commands = require('command');

//TODO - this is not pretty

export class Controller {
	constructor(private model: KnockoutObservable<mdl.Account>, private viewModel: vm.Account, private commandProcessor: Commands.CommandProcessor) {
		this.viewModel.isAdmin = ko.observable<boolean>(false);
		
		this.initializeListOfAvailableAccounts();
		
		this.model.subscribe(account => {
			this.updateAccountViewModel(); //order of commands may cause problems! -> not yet logged in but already did sth.
			this.login();
			this.commandProcessor.floodCommand(new ctr.HandleChangedAccountCommand());
		});
		
		this.viewModel.userName = ko.observable<string>();
		this.viewModel.userName.subscribe(userName => {
			if(this.model().userName != userName)
				this.model(new mdl.Account({ userName: userName }));
		});
		
		this.updateAccountViewModel();
		this.login();
	}
	
	private initializeListOfAvailableAccounts() {
		this.viewModel.availableAccounts = ko.observableArray<string>(['anonymous']);
		this.commandProcessor.processCommand(new Communicator.GetAllUsersCommand(users => {
			this.viewModel.availableAccounts(users);
		}));
	}
	
	private updateAccountViewModel() {
		if(this.viewModel.userName() != this.model().userName)
			this.viewModel.userName(this.model().userName);
	}
	
	public loginAs(userName: string) {
		console.log('name', userName);
		this.commandProcessor.processCommand(new Communicator.LoginCommand(userName));
	}
	
	public login() {
		this.loginAs(this.model().userName);
	}
}