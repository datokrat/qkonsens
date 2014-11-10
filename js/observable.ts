import Events = require('event');
import Common = require('common');

export interface Observable<T> {
	(): T;
	(T): void;
	subscribe( callback: (T) => void ): Subscription;
	
	dispose(): void;
}

export interface Subscription {
	dispose(): void;
}

export interface ObservableArray<T> extends Observable<T[]> {
	push(item: T): void;
	remove(item: T): void;
}

export interface ObservableArrayEx<T> {
	get(): T[];
	set(value: T[]): void;
	
	push(item: T): void;
	remove(item: T): void;

	pushed: Events.Event<T>;
	removed: Events.Event<T>;
	changed: Events.Event<T[]>;
	
	dispose(): void;
}

export class ObservableArrayExtender<T> implements ObservableArrayEx<T> {
	constructor(innerObservable: ObservableArray<T>) {
		this.innerObservable = innerObservable;
	}
	
	public get(): T[] {
		return this.innerObservable();
	}
	
	public set(value: T[]): void {
		var old = this.innerObservable();
		this.innerObservable(value);
		this.changed.raise(old);
	}
	
	public push(item: T): void {
		this.innerObservable.push(item);
		this.pushed.raise(item);
	}
	
	public remove(item: T): void {
		this.innerObservable.remove(item);
		this.removed.raise(item);
	}
	
	public subscribe( handler: (T) => void ): Subscription {
		return this.innerObservable.subscribe(handler);
	}
	
	public dispose() {
		this.innerObservable.dispose();
	}
	
	public pushed = new Events.EventImpl<T>();
	public removed = new Events.EventImpl<T>();
	public changed = new Events.EventImpl<T[]>();
	private innerObservable: ObservableArray<T>;
}