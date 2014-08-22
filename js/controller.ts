import mdl = require('model')
import vm = require('viewmodel')
import topicNavigationCtr = require('topicnavigationcontroller')

import frame = require('frame')
import noneWin = require('windows/none')
import kokiWin = require('windows/konsenskiste')
import kokiWinCtr = require('windows/konsenskistecontroller')

export class Controller {
	constructor(model: mdl.Model, viewModel: vm.ViewModel) {
		var topicNavigationController = new topicNavigationCtr.Controller(model.topicNavigation, viewModel.topicNavigation);
		
		this.kkWin = new kokiWin.Win;
		this.kkWinController = new kokiWinCtr.Controller(model.konsenskiste(), this.kkWin);
		
		model.konsenskiste.subscribe( newKoki => this.kkWinController.setKonsenskisteModel(newKoki) );
		
		viewModel.left = new frame.WinContainer( new noneWin.Win() );
		viewModel.right = new frame.WinContainer( new noneWin.Win() );
		viewModel.center = new frame.WinContainer( this.kkWin );
	}
	
	private kkWin: kokiWin.Win;
	private kkWinController: kokiWinCtr.Controller;
}