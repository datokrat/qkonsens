import Events = require('event')
import ContentModel = require('contentmodel')

export interface Main {
	generalContentRetrieved: Events.Event<GeneralContentRetrievedArgs>;
	contextRetrieved: Events.Event<ContextRetrievedArgs>;
	
	queryGeneral(id: number);
	queryContext(id: number);
	query(id: number);
	
	updateGeneral(model: ContentModel.General, callbacks: { then: () => void; error?: (error) => void });
	updateContext(model: ContentModel.Context, callbacks: { then: () => void; error?: (error) => void });
}

export interface GeneralContentRetrievedArgs {
	general: ContentModel.General;
}

export interface ContextRetrievedArgs {
	context: ContentModel.Context;
}