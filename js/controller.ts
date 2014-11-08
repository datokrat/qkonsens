import mdl = require('model')
import vm = require('viewmodel')
import topicNavigationCtr = require('topicnavigationcontroller')

import frame = require('frame')
import noneWin = require('windows/none')
import kokiWin = require('windows/konsenskiste')
import DiscussionWindow = require('windows/discussion')
import kokiWinCtr = require('windows/konsenskistecontroller')
import KokiControllerFactory = require('factories/konsenskistecontroller')
import Communicator = require('communicator')
import KokiCommunicator = require('konsenskistecommunicator')
import ViewModelContext = require('viewmodelcontext')

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel, communicator: Communicator.Main) {
		var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel.topicNavigation);
		
		this.kkWin = new kokiWin.Win();
		
		viewModel.left = new frame.WinContainer( new noneWin.Win() );
		viewModel.right = new frame.WinContainer( new noneWin.Win() );
		viewModel.center = new frame.WinContainer( this.kkWin );
		
		var globalContext = new ViewModelContext(viewModel.left, viewModel.right, viewModel.center);
		globalContext.konsenskisteWindow = this.kkWin;
		globalContext.discussionWindow = new DiscussionWindow.Win();
		globalContext.konsenskisteModel = model.konsenskiste;
		
		this.kkWinController = new kokiWinCtr.Controller(model.konsenskiste(), this.kkWin, communicator.konsenskiste)
			.setContext(globalContext);
		this.communicator = communicator;
		
		model.konsenskiste.subscribe( newKoki => this.kkWinController.setKonsenskisteModel(newKoki) );
		
		this.communicator.konsenskiste.received.subscribe( (args: KokiCommunicator.ReceivedArgs) => {
			if(args.id == model.konsenskiste().id()) {
				model.konsenskiste( args.konsenskiste );
			}
		} );
	}
	
	public dispose() {
		this.kkWinController.dispose();
	}
	
	private kkWin: kokiWin.Win;
	private kkWinController: kokiWinCtr.Controller;
	private communicator: Communicator.Main;
}