import Events = require('../event')
import Interface = require('../contentcommunicator')
import ContentModel = require('../contentmodel')

class TestCommunicator implements Interface.Main {
	public retrieved = new Events.EventImpl<Interface.ReceivedArgs>();
	private testContent: any = {};
	
	public setTestContent(content: ContentModel.Model) {
		if(typeof content.id === 'number') {
			this.testContent[content.id] = content;
		}
		else throw new Error('TestContentCommunicator.setTestContent: content.id is not a number');
	}
	
	public queryContent(id: number) {
		var content = this.testContent[id];
		if(typeof content !== 'undefined') {
			this.retrieved.raise({ id: id, content: content });
		}
		else throw new Error('TestContentCommunicator.queryContent: id not found');
	}
}

export = TestCommunicator;