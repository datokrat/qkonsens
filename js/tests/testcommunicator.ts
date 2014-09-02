import Events = require('../event')
import Communicator = require('../communicator')
import Model = require('../model')

class TestCommunicator implements Communicator.Main {
	public contentRetrieved = new Events.EventImpl<Communicator.ContentReceivedArgs>();
}

export = TestCommunicator;