import Events = require('event')
import Obs = require('observable')
import Comment = require('comment')
import TestContentCommunicator = require('tests/testcontentcommunicator')
import ContentCommunicator = require('../contentcommunicator')

import Discussion = require('../discussable')
import DiscussableCommunicator = require('../discussablecommunicator')

class TestDiscussableCommunicator implements DiscussableCommunicator.Base {
	public content: ContentCommunicator.Main = new TestContentCommunicator();
	public commentsReceived = new Events.EventImpl<DiscussableCommunicator.ReceivedArgs>();
	
	public testItems: any = {};
	
	public queryCommentsOf(discussableId: number) {
		var item: Discussion.DiscussableModel = this.testItems[discussableId];
		if(typeof item !== 'undefined')
			this.commentsReceived.raise({ id: discussableId, comments: item.discussion().comments.get() });
		else
			throw new Error('TestDiscussableCommunicator.queryCommentsOf: discussableId[' + discussableId + '] not found');
	}
	
	public setTestDiscussable(discussable: Discussion.DiscussableModel) {
		this.testItems[discussable.id()] = discussable;
	}
}

export = TestDiscussableCommunicator;