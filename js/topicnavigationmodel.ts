import Topic = require('topic');
import Content = require('contentmodel');
import Evt = require('event');
import Obs = require('observable');

export interface Model {
	goBackToBreadcrumbTopic(index: number);
	
	selectedTopic: Obs.Observable<Topic.Model>;
	
	history: Obs.ObservableArrayEx<Topic.Model>;
	selectTopicFromHistory(topic: Topic.Model);
	
	children: Obs.ObservableArrayEx<Topic.Model>;
	selectChild(child: Topic.Model);
	
	kokis: Obs.ObservableArrayEx<Content.General>;
}

export class ParentTopicArray implements Obs.ReadonlyObservableArrayEx<Topic.Model> {
	constructor() {
	}
	
	public get(): Topic.Model[];
	public get(index: number): Topic.Model;
	
	public get(index?: number): any {
		if(arguments.length < 1)
			return this.history.get().slice(0, -1);
		
		else if(index < 0)
			return this.history.get(index-1);
		
		else if(index < this.history.get().length-1)
			return this.history.get(index);
		
		else
			return undefined;
	}
	
	public setHistory(history: Obs.ObservableArrayEx<Topic.Model>) {
		this.history = history;
		this.initHistory();
		this.changed.raise(this.get());
	}
	
	public initHistory() {
		this.disposeHistory();
		this.last = this.history.get(-1);
		this.historySubscriptions = [
			this.history.pushed.subscribe(item => {
				this.last = item;
				if(this.history.get().length > 1)
					this.pushed.raise(this.get(-1));
			}),
			this.history.removed.subscribe(item => {
				if(this.history.get().length == 0)
					return;
				else if(this.last == item)
					this.removed.raise(this.last = this.history.get(-1));
				else
					this.removed.raise(item);
			}),
			this.history.changed.subscribe(() => {
				this.last = this.history.get(-1);
				this.changed.raise(this.get());
			})
		];
	}
	
	public disposeHistory() {
		this.historySubscriptions.forEach(s => s.dispose());
		this.historySubscriptions = [];
	}
	
	public dispose() {
		this.disposeHistory();
	}
	
	public pushed = new Evt.EventImpl<Topic.Model>();
	public removed = new Evt.EventImpl<Topic.Model>();
	public changed = new Evt.EventImpl<Topic.Model[]>();
	private history: Obs.ObservableArrayEx<Topic.Model>;
	private last: Topic.Model;
	public historySubscriptions: Evt.Subscription[] = [];
}

export class ModelImpl implements Model {
	public goBackToBreadcrumbTopic(index: number) {
		this.history.removeMany(index + 1);
	}
	
	public selectChild(child: Topic.Model) {
		this.children.set([]);
		this.history.push(child);
	}
	
	public selectTopicFromHistory(topic: Topic.Model) {
		this.children.set([]);
		this.goBackToBreadcrumbTopic(this.history.get().indexOf(topic));
	}
	
	public history: Obs.ObservableArrayEx<Topic.Model> = new Obs.ObservableArrayExtender(ko.observableArray<Topic.Model>());
	public selectedTopic = ko.computed<Topic.Model>(() => this.history && this.history.get(-1));
	public children: Obs.ObservableArrayEx<Topic.Model> = new Obs.ObservableArrayExtender(ko.observableArray<Topic.Model>());
	public kokis: Obs.ObservableArrayEx<Content.General> = new Obs.ObservableArrayExtender(ko.observableArray<Content.General>());
}