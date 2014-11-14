///<reference path="../typings/knockout.d.ts" />
///<reference path="array.ts" />

import Topic = require('topic')

export interface Model {
	appendChild(child: Topic.Model);
	goBackToBreadcrumbTopic(index: number);
	
	getSelectedTopic(): Topic.Model;
	getBreadcrumbTopics(): Topic.Model[];
}

export class ModelImpl implements Model {
	public appendChild(child: Topic.Model) {
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

	public breadcrumbTopics = ko.observableArray<Topic.Model>()
}