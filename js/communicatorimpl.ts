import ICommunicator = require('communicator')
import KokiCommunicatorImpl = require('konsenskistecommunicatorimpl')
import IKokiCommunicator = require('konsenskistecommunicator')

class CommunicatorImpl implements ICommunicator.Main {
	public konsenskiste: IKokiCommunicator.Main = new KokiCommunicatorImpl.Main;
}

export = CommunicatorImpl;