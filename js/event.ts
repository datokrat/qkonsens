///<reference path="array.ts" />

export interface Event<Args> {
	subscribe(cb: (Args) => void);
	unsubscribe(cb: (Args) => void);
	raise(args: Args);
}

export class EventImpl<Args> implements Event<Args> {
	public subscribe(cb: (Args) => void) {
		if(!this.isListener(cb))
			this.listeners.push(cb);
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

	private isListener(cb: (Args) => void) {
		return this.listeners.indexOf(cb) != -1;
	}

	private listeners: Array<(Args) => void> = [];
}