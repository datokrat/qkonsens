import LocationHash = require('locationhash');
import Memory = require('memory');
import Commands = require('command');

export class Controller {
	constructor(private resources: Resources) {
		this.disposables.append(LocationHash.changed.subscribe(() => this.onHashChangedManually()));
	}
	
	private updateHash() {
	}
	
	private onHashChangedManually() {
	}
	
	
	private disposables = new Memory.DisposableContainer();
}

export class Resources {
}