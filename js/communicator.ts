import Events = require('event')
import ContentModel = require('contentmodel')

export interface Main {
	contentRetrieved: Events.Event<ContentReceivedArgs>;
}

export interface ContentReceivedArgs {
	id: number;
	content: ContentModel.Model;
}