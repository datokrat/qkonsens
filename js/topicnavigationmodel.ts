import Topic = require('topic');
import Konsenskiste = require('konsenskistemodel');
import Evt = require('event');
import Obs = require('observable');

export interface Model {
	goBackToBreadcrumbTopic(index: number);
	
	selectedTopic: Obs.Observable<Topic.Model>;
	
	history: Obs.ObservableArrayEx<Topic.Model>;
	selectTopicFromHistory(topic: Topic.Model);
	
	children: ChildrenModel;
	selectChild(child: Topic.Model);
	
	kokis: KokisModel;
}

export class ModelImpl implements Model {
	public goBackToBreadcrumbTopic(index: number) {
		this.history.removeMany(index + 1);
	}
	
	public selectChild(child: Topic.Model) {
		this.children.items.set([]);
		this.history.push(child);
	}
	
	public selectTopicFromHistory(topic: Topic.Model) {
		this.children.items.set([]);
		this.goBackToBreadcrumbTopic(this.history.get().indexOf(topic));
	}
	
	public history: Obs.ObservableArrayEx<Topic.Model> = new Obs.ObservableArrayExtender(ko.observableArray<Topic.Model>());
	public selectedTopic = ko.computed<Topic.Model>(() => this.history && this.history.get(-1));
	public children = new ChildrenModel();
	public kokis = new KokisModel();
}

export class QueryableItemCollection<T> {
	public items: Obs.ObservableArrayEx<T> = new Obs.ObservableArrayExtender(ko.observableArray<T>());
}

export class KokisModel extends QueryableItemCollection<Konsenskiste.Model> {}
export class ChildrenModel extends QueryableItemCollection<Topic.Model> {};