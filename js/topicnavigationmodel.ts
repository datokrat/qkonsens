import Topic = require('topic');
import Evt = require('event');
import Obs = require('observable');

export interface Model {
	appendChild(child: Topic.Model);
	goBackToBreadcrumbTopic(index: number);
	
	breadcrumbTopics: Obs.ObservableArrayEx<Topic.Model>;
	selectedTopic: Obs.Observable<Topic.Model>;
}

export interface SelectedTopicChangedArgs {
	oldValue: Topic.Model;
	newValue: Topic.Model;
}

export interface BreadcrumbTopicsChangedArgs {
}

export class ModelImpl implements Model {
	public appendChild(child: Topic.Model) {
		this.breadcrumbTopics.push(child);
	}
	
	public goBackToBreadcrumbTopic(index: number) {
		this.breadcrumbTopics.removeMany(index + 1);
	}
	
	public breadcrumbTopics = new Obs.ObservableArrayExtender(ko.observableArray<Topic.Model>());
	public selectedTopic = ko.computed<Topic.Model>(() => this.breadcrumbTopics && this.breadcrumbTopics.get(-1));
}