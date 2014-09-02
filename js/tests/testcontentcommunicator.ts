import Events = require('../event')
import Interface = require('../contentcommunicator')
import Model = require('../model')

class TestCommunicator implements Interface.Main {
	public retrieved = new Events.EventImpl<Interface.ReceivedArgs>();
}

export = TestCommunicator;