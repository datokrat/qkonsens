import Event = require("../event")

export interface Factory {
	create<Args>(): Event.Event<Args>;
}

export class FactoryImpl {
	public create<Args>(): Event.Event<Args> {
		return new Event.EventImpl<Args>();
	}
}