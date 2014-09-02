import unit = require('tests/tsunit')
import test = require('tests/test')

import Event = require('../event')
import EventFactory = require('factories/event')

export interface Disposable {
	dispose(): void;
}

export interface Factory<T> {
	create(): T;
}

export interface FactoryEx<T> extends Factory<T> {
	setEventFactory(fty: EventFactory.Factory);
}


export class Tests extends unit.TestClass {
	private factory: FactoryEx<Disposable>;
	private eventFactory = new TestEventFactory();
	
	constructor(factory: FactoryEx<Disposable>) {
		super();
		this.factory = factory;
		this.factory.setEventFactory(this.eventFactory);
	}
	
	test() {
		this.eventFactory.reset();
		var disposable = this.factory.create();
	}
}

interface GenericTestEvent {
	countListeners(): number;
}

class TestEvent<Args> implements Event.Event<Args>, GenericTestEvent {
	private event = new Event.EventImpl<Args>();
	
	constructor() {
		this.raiseThis = this.raise.bind(this);
	}
	
	public subscribe(cb: Event.Listener<Args>): Event.Subscription {
		this.listenerCtr++;
		this.event.subscribe(cb);
		return { undo: () => this.unsubscribe(cb) };
	}
	
	public unsubscribe(cb: Event.Listener<Args>): void {
		this.listenerCtr--;
		this.event.unsubscribe(cb);
	}
	
	public raise(args: Args) {
		this.event.raise(args);
	}
	
	public raiseThis: (args?: Args) => void;
	
	public countListeners(): number {
		return this.listenerCtr;
	}
	
	private listenerCtr = 0;
}

class TestEventFactory {
	public create<Args>(): TestEvent<Args> {
		var ret = new TestEvent<Args>();
		this.allEvents.push(ret);
		
		return ret;
	}
	
	public reset() {
		this.allEvents = [];
	}
	
	public allEvents: GenericTestEvent[] = [];
}