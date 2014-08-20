import koki = require('../konsenskistemodel')
import EventFactory = require('./event')

export class Factory {
	public create(title: string, text?: string): koki.Model {
		var konsenskiste = new koki.Model({ eventFactory: this.eventFactory });
		konsenskiste.content.title(title);
		konsenskiste.content.text(text);
		return konsenskiste;
	}
	
	public setEventFactory(value: EventFactory.Factory): Factory {
		this.eventFactory = value;
		return this;
	}
	
	private eventFactory: EventFactory.Factory;
}