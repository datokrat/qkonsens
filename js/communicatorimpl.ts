import ICommunicator = require('communicator')
import KokiCommunicatorImpl = require('konsenskistecommunicatorimpl')
import IKokiCommunicator = require('konsenskistecommunicator');
import Topic = require('topic');
import TopicImpl = require('topiccommunicatorimpl');

class CommunicatorImpl implements ICommunicator.Main {
	public konsenskiste: IKokiCommunicator.Main = new KokiCommunicatorImpl.Main;
	public topic: Topic.Communicator = new TopicImpl.Main();
}

export = CommunicatorImpl;