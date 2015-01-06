import KokiCommunicator = require('konsenskistecommunicator');
import Topic = require('topic');
import Commands = require('command');

export interface Main {
	konsenskiste: KokiCommunicator.Main;
	topic: Topic.Communicator;
	
	commandProcessor: Commands.CommandProcessor;
}

export class LoginCommand extends Commands.Command {
	constructor(public userName: string) { super() }
	
	public toString() { return 'LoginCommand ' + JSON.stringify(this) }
}