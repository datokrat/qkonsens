import LocationHash = require('locationhash');
import Memory = require('memory');
import Commands = require('command');
import KonsenskisteWinController = require('windows/konsenskistecontroller');
import KokiLogic = require('kokilogic');

export class Controller {
	constructor(private resources: Resources) {
		/*this.commandProcessor.chain.append(cmd => {
		});*/
		
		this.disposables.append(this.resources.commandProcessor.chain.append(cmd => {
			if(cmd instanceof KokiLogic.HandleChangedKokiWinStateCommand) {
				var changedKokiWinState = <KokiLogic.HandleChangedKokiWinStateCommand>cmd;
				LocationHash.set(JSON.stringify(changedKokiWinState.state));
				return true;
			}
		}));
		this.disposables.append(LocationHash.changed.subscribe(hashString => this.onHashChangedManually(hashString)));
	}
	
	public initialize() {
		this.onHashChangedManually(LocationHash.get());
	}
	
	public onHashChangedManually(hashString: string) {
		var jsonString = hashString.substring(1);
		
		try { this.state = JSON.parse(jsonString); }
		catch(e) { }

		this.resources.commandProcessor.processCommand(new ChangeKokiStateCommand(this.state));
	}
	
	public dispose() {
		this.disposables.dispose();
	}
	
	public commandProcessor = new Commands.CommandProcessor();
	
	private state: KonsenskisteWinController.State = { kokiId: 12 };
	private disposables = new Memory.DisposableContainer();
}

export class Resources {
	public commandProcessor: Commands.CommandProcessor;
}

export class ChangeKokiStateCommand extends Commands.Command {
	constructor(public state: KonsenskisteWinController.State) { super() }
	
	public toString() { return 'ChangeKokiStateCommand' }
}