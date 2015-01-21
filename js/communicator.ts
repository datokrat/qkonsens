import KokiCommunicator = require('konsenskistecommunicator');
import Topic = require('topic');
import Commands = require('command');

export interface Main {
	konsenskiste: KokiCommunicator.Main;
	topic: Topic.Communicator;
	
	commandProcessor: Commands.CommandProcessor;
}

//TODO: add callback
export class LoginCommand {
	constructor(public userName: string) { }
	
	public toString() { return 'LoginCommand ' + JSON.stringify(this) }
}

export class GetAllUsersCommand {
	constructor(public then: (users: string[]) => void) { }
	public toString() { return 'GetAllUsersCommand' }
}