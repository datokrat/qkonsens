import KokiCommunicator = require('konsenskistecommunicator');
import Topic = require('topic');
import Commands = require('command');

export interface Main {
	konsenskiste: KokiCommunicator.Main;
	topic: Topic.Communicator;
	
	commandProcessor: Commands.CommandProcessor;
}

export class LoginCommand {
	constructor(public userName: string) { }
	
	public toString() { return 'LoginCommand ' + JSON.stringify(this) }
}