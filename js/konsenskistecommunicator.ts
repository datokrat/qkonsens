import Events = require('event')
import ContentCommunicator = require('contentcommunicator')
import KernaussageCommunicator = require('kernaussagecommunicator')
import DiscussionCommunicator = require('discussioncommunicator')
import KonsenskisteModel = require('konsenskistemodel')
import Comment = require('comment')

export interface Main {
	content: ContentCommunicator.Main;
	kernaussage: KernaussageCommunicator.Main;
	discussion: DiscussionCommunicator.Base;
	
	received: Events.Event<ReceivedArgs>;
	queryKoki(id: number);
}

export interface ReceivedArgs {
	id: number;
	konsenskiste: KonsenskisteModel.Model;
}