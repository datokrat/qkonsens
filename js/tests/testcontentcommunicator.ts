import Events = require('../event')
import Interface = require('../contentcommunicator')
import ContentModel = require('../contentmodel')

class TestCommunicator implements Interface.Main {
	public generalContentRetrieved = new Events.EventImpl<Interface.GeneralContentRetrievedArgs>();
	public contextRetrieved = new Events.EventImpl<Interface.ContextRetrievedArgs>();
	private generalTestContent: any = {};
	private testContext: any = {};
	
	public setGeneralTestContent(generalContent: ContentModel.General) {
		if(typeof generalContent.postId === 'number')
			this.generalTestContent[generalContent.postId] = generalContent;
		else throw new Error('TestContentCommunicator.setGeneralTestContent: generalContent.id is not a number');
	}
	
	public setTestContext(context: ContentModel.Context) {
		if(typeof context.id === 'number')
			this.testContext[context.id] = context;
		else throw new Error('TestContentCommunicator.setTestContext: context.id is not a number');
	}
	
	public queryGeneral(id: number) {
		var generalContent = this.generalTestContent[id];
		if(typeof generalContent !== 'undefined') {
			this.generalContentRetrieved.raise({ general: generalContent });
		}
		else throw new Error('TestContentCommunicator.queryGeneralContent: id not found');
	}
	
	public queryContext(id: number) {
		var context = this.testContext[id];
		if(typeof context !== 'undefined')
			this.contextRetrieved.raise({ context: context });
		else throw new Error('TestContentCommunicator.queryContext: id not found');
	}
	
	public updateGeneral(model: ContentModel.General, callbacks: { then: () => void; error?: (error) => void }) {
		var generalContent = this.generalTestContent[model.postId];
		if(typeof generalContent !== 'undefined')
			callbacks.then();
		else throw new Error('updateGeneral: id not found');
	}
	
	public query(id: number) {
	}
}

export = TestCommunicator;