import koki = require('../konsenskistemodel')
import EventFactory = require('./event')

export class Factory {
	public create(title: string, text?: string): koki.Model {
		var konsenskiste = new koki.Model({ eventFactory: this.eventFactory });
		konsenskiste.general().title(title);
		konsenskiste.general().text(text);
		return konsenskiste;
	}
	
	public setEventFactory(value: EventFactory.Factory): Factory {
		this.eventFactory = value;
		return this;
	}
	
	private eventFactory: EventFactory.Factory;
}