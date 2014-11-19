import KokiCommunicator = require('konsenskistecommunicator');
import Topic = require('topic');

export interface Main {
	konsenskiste: KokiCommunicator.Main;
	topic: Topic.Communicator;
}