import Events = require('event')
import ContentModel = require('contentmodel')

export interface Main {
	retrieved: Events.Event<ReceivedArgs>;
	
	queryContent(id: number);
}

export interface ReceivedArgs {
	id: number;
	content: ContentModel.Model;
}