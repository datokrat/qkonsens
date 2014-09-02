///<reference path="array.ts" />

export interface Event<Args> {
	subscribe(cb: (Args) => void);
	unsubscribe(cb: (Args) => void);
	raise(args?: Args);
	raiseThis(args?: Args);
}

export interface Listener<Args> {
	(Args): void;
}

export class Subscription {
	undo: () => void;
}

export class EventImpl<Args> implements Event<Args> {
	constructor() {
		this.raiseThis = this.raise.bind(this);
	}

	public subscribe(cb: (Args) => void): Subscription {
		if(!this.isListener(cb))
			this.listeners.push(cb);
		
		return { undo: () => this.unsubscribe(cb) };
	}

	public unsubscribe(cb: (Args) => void) {
		if(this.isListener(cb))
			this.listeners.removeOne(cb);
	}

	public raise(args?: Args) {
		this.listeners.forEach(function(l: (Args) => void) {
			l(args);
		});
	}
	
	public raiseThis: (args?: Args) => void;

	private isListener(cb: (Args) => void) {
		return this.listeners.indexOf(cb) != -1;
	}

	private listeners: Array<(Args) => void> = [];
}

export class Void {}