import Communicator = require('communicator')
import KokiCommunicatorImpl = require('konsenskistecommunicatorimpl')
import IKokiCommunicator = require('konsenskistecommunicator');
import Topic = require('topic');
import TopicImpl = require('topiccommunicatorimpl');
import Commands = require('command');
import disco = require('disco');
import discoContext = require('discocontext');

class CommunicatorImpl implements Communicator.Main {
	public konsenskiste: IKokiCommunicator.Main = new KokiCommunicatorImpl.Main;
	public topic: Topic.Communicator = new TopicImpl.Main();
	
	public commandProcessor = new Commands.CommandProcessor();
	
	constructor() {
		this.commandProcessor.chain.append(cmd => {
			if(cmd instanceof Communicator.LoginCommand) {
				var typedCmd = <Communicator.LoginCommand>cmd;
				disco.AuthData = () => ({ user: typedCmd.userName, password: 'password' });
				return true;
			}
			return false;
		});
		this.commandProcessor.chain.append(cmd => {
			if(cmd instanceof Communicator.GetAllUsersCommand) {
				var typedCmd = <Communicator.GetAllUsersCommand>cmd;
				discoContext.Users.toArray().then(users => typedCmd.then(users.map(u => u.Alias)));
				return true;
			}
			return false;
		});
	}
}

export = CommunicatorImpl;