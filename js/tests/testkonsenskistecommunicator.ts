import newId = require('../id');
import Events = require('event');
import ItemContainer = require('itemcontainer');

import KokiCommunicator = require('../konsenskistecommunicator');
import TestContentCommunicator = require('tests/testcontentcommunicator');
import TestKaCommunicator = require('tests/testkernaussagecommunicator');
import TestDiscussionCommunicator = require('tests/testdiscussioncommunicator');
import TestRatingCommunicator = require('tests/testratingcommunicator');

import KonsenskisteModel = require('../konsenskistemodel');
import KernaussageModel = require('../kernaussagemodel');


export class Main implements KokiCommunicator.Main {
	public content: TestContentCommunicator;
	public kernaussage: TestKaCommunicator;
	
	public received = new Events.EventImpl<KokiCommunicator.ReceivedArgs>();
	public receiptError = new Events.EventImpl<KokiCommunicator.ReceiptErrorArgs>();
	public kernaussageAppended = new Events.EventImpl<KokiCommunicator.KaAppendedArgs>();
	public kernaussageAppendingError = new Events.EventImpl<KokiCommunicator.KaAppendingErrorArgs>();
	
	private testItems = new ItemContainer.Main<KonsenskisteModel.Model>();
	public discussion = new TestDiscussionCommunicator();
	public rating = new TestRatingCommunicator.Main(this.testItems);
	
	constructor() {
		this.discussion.insertTestItemContainer(this.testItems);
		this.content = new TestContentCommunicator();
		this.kernaussage = new TestKaCommunicator({ content: this.content });
	}
	
	public setTestKoki(koki: KonsenskisteModel.Model) {
		if(typeof koki.id() === 'number') {
			this.testItems.set(koki.id(), koki);
		}
		else throw new Error('TestKokiCommunicator.setTestKoki: koki.id is not a number');
	}
	
	public query(id: number, out?: KonsenskisteModel.Model): KonsenskisteModel.Model {
		try {
			out = out || new KonsenskisteModel.Model();
			out.id(id);
			out.queryState().loading(true);
			out.set(this.testItems.get(id));
		}
		catch(e) {
			out.queryState().error('id[' + id + '] not found');
			out.queryState().loading(false);
			this.receiptError.raise({ id: id, message: 'id[' + id + '] not found', konsenskiste: out });
			return out;
		}
		out.queryState().error(null);
		out.queryState().loading(false);
		this.received.raise({ id: id, konsenskiste: out });
		return out;
	}
	
	public createAndAppendKa(kokiId: number, kaData: KokiCommunicator.KernaussageData) {
		try {
			var koki = this.testItems.get(kokiId);
		}
		catch(e) {
			this.kernaussageAppendingError.raise({
				konsenskisteId: kokiId, 
				message: "createAndAppendKa: kokiId[" + kokiId + "] not found"
			});
			return;
		}
		var ka = new KernaussageModel.Model();
		ka.general().title(kaData.title);
		ka.general().text(kaData.text);
		ka.id(newId());
		this.kernaussage.setTestKa(ka);
		koki.childKas.push(ka);
		this.kernaussageAppended.raise({
			konsenskisteId: kokiId, 
			kernaussageId: ka.id(), 
			kernaussageData: kaData 
		});
	}
	
	public create(kokiData: KokiCommunicator.KonsenskisteData, parentTopicId: number, then: (id: number) => void) {
		var koki = new KonsenskisteModel.Model();
		koki.id(newId());
		koki.general().title(kokiData.title);
		koki.general().text(kokiData.text);
		this.testItems.set(koki.id(), koki);
		then(koki.id());
	}
}

export class Stub implements KokiCommunicator.Main {
	public content = new TestContentCommunicator();
	public kernaussage = new TestKaCommunicator();
	
	public received = new Events.EventImpl<KokiCommunicator.ReceivedArgs>();
	public receiptError = new Events.EventImpl<KokiCommunicator.ReceiptErrorArgs>();
	public kernaussageAppended = new Events.EventImpl<KokiCommunicator.KaAppendedArgs>();
	public kernaussageAppendingError = new Events.EventImpl<KokiCommunicator.KaAppendingErrorArgs>();
	public discussion = new TestDiscussionCommunicator();
	public rating = new TestRatingCommunicator.Stub();
	
	public query(id: number, out?: KonsenskisteModel.Model): KonsenskisteModel.Model { throw new Error('not implemented') }
	public createAndAppendKa(kokiId: number, ka: KokiCommunicator.KernaussageData) { throw new Error('not implemented') }
	public create(koki: KokiCommunicator.KonsenskisteData, parentTopicId: number, then: (id: number) => void) { throw new Error('not implemented') }
}