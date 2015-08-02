import Command = require('command');
import MainController = require('controller');

export class Model {
}

export class ViewModel {
	environsClick: () => void;
}

export class Controller {
	constructor(private model: Model, private viewModel: ViewModel, private controllerArgs: ControllerArgs) {
		viewModel.environsClick = () => {
			controllerArgs.commandProcessor.processCommand(new MainController.OpenEnvironsWindowCommand());
		};
	}
	
	public dispose() {
		this.viewModel.environsClick = function() {};
	}
}

export interface ControllerArgs {
	commandProcessor: Command.CommandProcessor;
}