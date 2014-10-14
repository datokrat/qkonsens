import Events = require('../event')
import Obs = require('../observable')
import ItemContainer = require('../itemcontainer')
import Comment = require('../comment')
import TestContentCommunicator = require('tests/testcontentcommunicator')
import ContentCommunicator = require('../contentcommunicator')

import Discussion = require('../discussion')
import DiscussableCommunicator = require('../discussioncommunicator')

class TestDiscussableCommunicator implements DiscussableCommunicator.Base {
	public content: ContentCommunicator.Main = new TestContentCommunicator();
	public commentsReceived = new Events.EventImpl<DiscussableCommunicator.ReceivedArgs>();
	
	constructor(private testItems: ItemContainer.Base<Discussion.DiscussableModel> = new ItemContainer.Main<Discussion.DiscussableModel>()) {}
	
	public queryCommentsOf(discussableId: number) {
		try {
			var item: Discussion.DiscussableModel = this.testItems.get(discussableId);
		}
		catch(e) {
			throw new Error('TestDiscussableCommunicator.queryCommentsOf: discussableId[' + discussableId + '] not found');
			return;
		}
		this.commentsReceived.raise({ id: discussableId, comments: item.discussion().comments.get() });
	}
	
	public setTestDiscussable(discussable: Discussion.DiscussableModel) {
		this.testItems.set(discussable.id(), discussable);
	}
}

export = TestDiscussableCommunicator;