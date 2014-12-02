import mdl = require('model')
import vm = require('viewmodel')
import topicNavigationCtr = require('topicnavigationcontroller')
import LocationHash = require('locationhash');
import Evt = require('event');

import frame = require('frame')
import noneWin = require('windows/none')
import KokiWin = require('windows/konsenskiste');
import BrowseWin = require('windows/browse');
import DiscussionWindow = require('windows/discussion')
import kokiWinCtr = require('windows/konsenskistecontroller')
import KokiControllerFactory = require('factories/konsenskistecontroller')
import Communicator = require('communicator')
import KokiCommunicator = require('konsenskistecommunicator')
import ViewModelContext = require('viewmodelcontext')
import Topic = require('topic');

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: Communicator.Main) {
		var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel.topicNavigation, communicator.topic);
		
		this.kkWin = new KokiWin.Win();
		this.browseWin = new BrowseWin.Win();
		
		viewModel.left = new frame.WinContainer( new noneWin.Win() );
		viewModel.right = new frame.WinContainer( this.browseWin );
		viewModel.center = new frame.WinContainer( this.kkWin );
		
		var globalContext = new ViewModelContext(viewModel.left, viewModel.right, viewModel.center);
		globalContext.konsenskisteWindow = this.kkWin;
		globalContext.discussionWindow = new DiscussionWindow.Win();
		globalContext.konsenskisteModel = model.konsenskiste;
		
		this.kkWinController = new kokiWinCtr.Controller(model.konsenskiste(), this.kkWin, communicator.konsenskiste)
			.setContext(globalContext);
		
		this.browseWinController = new BrowseWin.Controller(model.topicNavigation, this.browseWin, communicator.topic);
		
		this.communicator = communicator;
		
		model.konsenskiste.subscribe( newKoki => this.kkWinController.setKonsenskisteModel(newKoki) );
		
		var rootTopic = new Topic.Model();
		rootTopic.id = { root: true, id: undefined };
		rootTopic.text('[root]');
		model.topicNavigation.history.push(rootTopic);
		
		this.kkWin.state.subscribe(state => LocationHash.set(JSON.stringify(state), false));
		this.subscriptions = [ LocationHash.changed.subscribe(() => this.onHashChanged()) ];
		this.onHashChanged();
	}
	
	public dispose() {
		this.kkWinController.dispose();
		this.subscriptions.forEach(s => s.dispose());
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
	
	private kkWin: KokiWin.Win;
	private kkWinController: kokiWinCtr.Controller;
	private browseWin: BrowseWin.Win;
	private browseWinController: BrowseWin.Controller;
	private communicator: Communicator.Main;
	
	private subscriptions: Evt.Subscription[] = [];
}