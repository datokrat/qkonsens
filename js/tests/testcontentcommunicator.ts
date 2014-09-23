import Events = require('../event')
import Interface = require('../contentcommunicator')
import ContentModel = require('../contentmodel')

class TestCommunicator implements Interface.Main {
	public generalContentRetrieved = new Events.EventImpl<Interface.GeneralContentRetrievedArgs>();
	public contextRetrieved = new Events.EventImpl<Interface.ContextRetrievedArgs>();
	private generalTestContent: any = {};
	
	public setGeneralTestContent(generalContent: ContentModel.General) {
		if(typeof generalContent.id === 'number') {
			this.generalTestContent[generalContent.id] = generalContent;
		}
		else throw new Error('TestContentCommunicator.setGeneralTestContent: generalContent.id is not a number');
	}
	
	public queryGeneral(id: number) {
		var generalContent = this.generalTestContent[id];
		if(typeof generalContent !== 'undefined') {
			this.generalContentRetrieved.raise({ general: generalContent });
		}
		else throw new Error('TestContentCommunicator.queryGeneralContent: id not found');
	}
	
	public queryContext(id: number) {
	}
	
	public query(id: number) {
	}
}

export = TestCommunicator;