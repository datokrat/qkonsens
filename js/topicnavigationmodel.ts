///<reference path="../typings/knockout.d.ts" />
///<reference path="array.ts" />

import tpc = require('topic')

export interface Model {
	appendChild(child: tpc.Topic);
	goBackToBreadcrumbTopic(index: number);
	
	getSelectedTopic(): tpc.Topic;
	getBreadcrumbTopics(): tpc.Topic[];
}

export class ModelImpl implements Model {
	public appendChild(child: tpc.Topic) {
		this.breadcrumbTopics.push(child);
	}
	
	public goBackToBreadcrumbTopic(index: number) {
		this.breadcrumbTopics.splice(index + 1);
	}
	
	public getSelectedTopic() {
		return this.breadcrumbTopics().get(-1);
	}
	
	public getBreadcrumbTopics() {
		return this.breadcrumbTopics();
	}

	public breadcrumbTopics = ko.observableArray<tpc.Topic>()
}