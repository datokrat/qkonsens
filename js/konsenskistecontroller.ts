import evt = require('event')
import ConstructorBasedFactory = require('factories/constructorbased')
import Obs = require('observable')
import Commands = require('command');

import mdl = require('konsenskistemodel')
import vm = require('konsenskisteviewmodel')
import ViewModelContext = require('viewmodelcontext')

import kernaussageVm = require('kernaussageviewmodel')
import KokiCommunicator = require('konsenskistecommunicator')

import ContentViewModel = require('contentviewmodel')
import Discussion = require('discussion')
import DiscussionCommunicator = require('discussioncommunicator')

import Comment = require('comment')
import KernaussageFactory = require('factories/kernaussagemodel')

import KSync = require('synchronizers/ksynchronizers')
import KokiSync = require('synchronizers/kokisynchronizers')
import CommentSynchronizer = require('synchronizers/comment')

import KElement = require('kelement');

export interface Controller {
	dispose(): void;
	setViewModelContext(cxt: ViewModelContext): void;
}

export class ControllerImpl extends KElement.Controller<mdl.Model, vm.ViewModel, KokiCommunicator.Main> implements Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel, private args: ControllerArgs) {
		super(model, viewModel, args.communicator, args.commandProcessor);
		this.init(model, viewModel, args.communicator);
	}
	
	private init(model: mdl.Model, viewModel: vm.ViewModel, communicator: KokiCommunicator.Main) {
		this.initCommunicator();
		this.initProperties();
		this.initKas();
	}
	
	public setViewModelContext(cxt: ViewModelContext) {
		this.cxt = cxt;
		this.discussionSynchronizer.setViewModelContext(cxt);
		this.kaSynchronizer.setViewModelContext(cxt);
		return this;
	}
	
	private initProperties() {
		this.viewModel.loading = this.model.loading;
		this.viewModel.error = this.model.error;
	}
	
	private initKas() {
		this.viewModel.childKas = ko.observableArray<kernaussageVm.ViewModel>();
		this.viewModel.newKaFormVisible = ko.observable<boolean>(false);
		this.viewModel.newKaTitle = ko.observable<string>();
		this.viewModel.newKaText = ko.observable<string>();
		this.viewModel.newKaContext = ko.observable<string>();
		this.viewModel.newKaClick = () => {
			var oldValue = this.viewModel.newKaFormVisible();
			this.viewModel.newKaFormVisible(!oldValue);
		}
		this.viewModel.newKaSubmit = () => {
			var kaFactory = new KernaussageFactory.Factory();
			var ka = kaFactory.create(this.viewModel.newKaText(), this.viewModel.newKaTitle());
			if(this.viewModel.newKaContext()) ka.context().text(this.viewModel.newKaContext());
			this.communicator.kernaussageAppended.subscribeUntil(args => {
				if(args.konsenskisteId == this.model.id() && args.kernaussage == ka) {
					this.viewModel.newKaFormVisible(false);
					return true;
				}
			});
			this.communicator.createAndAppendKa(this.model.id(), ka);
		}
		
		this.kaSynchronizer = new KokiSync.KaSynchronizer({ communicator: this.communicator.kernaussage, commandProcessor: this.args.commandProcessor });
		this.kaSynchronizer
			.setViewModelObservable(this.viewModel.childKas)
			.setModelObservable(this.model.childKas);
	}
	
	private initCommunicator() {
		this.communicatorSubscriptions = ([
			this.communicator.received.subscribe(this.onKokiReceived),
			this.communicator.kernaussageAppended.subscribe(this.onKaAppended)
		]);
	}
	
	private onKokiReceived = (args: KokiCommunicator.ReceivedArgs) => {
		if(this.model.id() == args.konsenskiste.id())
			this.model.set( args.konsenskiste );
	}
	
	private onKaAppended = (args: KokiCommunicator.KaAppendedArgs) => {
		if(this.model.id() == args.konsenskisteId)
			this.model.childKas.push(args.kernaussage);
	}
	
	public dispose() {
		KElement.Controller.prototype.dispose.apply(this, arguments);
		
		this.modelSubscriptions.forEach( s => s.dispose() );
		this.communicatorSubscriptions.forEach( s => s.dispose() );
	}
	
	private kaSynchronizer: KokiSync.KaSynchronizer;
	
	private modelSubscriptions: evt.Subscription[] = [];
	private communicatorSubscriptions: evt.Subscription[] = [];
}

export interface ControllerArgs {
	communicator: KokiCommunicator.Main;
	commandProcessor: Commands.CommandProcessor;
}