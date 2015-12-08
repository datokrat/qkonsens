import frame = require('frame');
import CommandProcessor = require('../command');

export class Win extends frame.Win {
	constructor(private commandProcessor: CommandProcessor.CommandProcessor) {
		super('environs-win-template', null);
        console.log(this.commandProcessor);
	}
	
	public submitClick = () => {
		// this.commandProcessor.processCommand(new KommandoDasEsNochNichtGibt());
	}
}