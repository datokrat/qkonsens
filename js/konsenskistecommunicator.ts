import Events = require('event')
import ContentCommunicator = require('contentcommunicator')
import KonsenskisteModel = require('konsenskistemodel')

export interface Main {
	content: ContentCommunicator.Main;
	received: Events.Event<ReceivedArgs>;
	
	queryKoki(id: number);
}

export interface ReceivedArgs {
	id: number;
	konsenskiste: KonsenskisteModel.Model;
}