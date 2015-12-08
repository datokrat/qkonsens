import Command = require('command');
import MainController = require('controller');
import Windows = require('windows');
import KokiLogic = require('kokilogic');

export class Model {
    public parentID: any;
    public text = ko.observable<string>()
}

export class ViewModel {
	environsClick: () => void;
}

export class Controller {
	constructor(private model: Model, private viewModel: ViewModel, private controllerArgs: ControllerArgs) {
		viewModel.environsClick = () => {
			controllerArgs.commandProcessor.processCommand(new Windows.OpenEnvironsWindowCommand());
            controllerArgs.commandProcessor.processCommand(new KokiLogic.LoadEnvironsCommand(model.parentID,(model:Model) => {
                alert(model.text())
            }));
		};
	}
	
	public dispose() {
		this.viewModel.environsClick = function() {};
	}
}

export interface ControllerArgs {
	commandProcessor: Command.CommandProcessor;
}

export class Communicator {
    public loadEnvirons(kElementID: any, success: (model: Model) => void) {
        var model = new Model;
        model.text("Wir freuen uns.");
        success(model);
        }
}