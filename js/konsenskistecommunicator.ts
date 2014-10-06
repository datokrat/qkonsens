import Events = require('event')
import ContentCommunicator = require('contentcommunicator')
import KernaussageCommunicator = require('kernaussagecommunicator')
import DiscussableCommunicator = require('discussablecommunicator')
import KonsenskisteModel = require('konsenskistemodel')
import Comment = require('comment')

export interface Main extends DiscussableCommunicator.Base {
	content: ContentCommunicator.Main;
	kernaussage: KernaussageCommunicator.Main;
	received: Events.Event<ReceivedArgs>;
	
	queryKoki(id: number);
}

export interface ReceivedArgs {
	id: number;
	konsenskiste: KonsenskisteModel.Model;
}