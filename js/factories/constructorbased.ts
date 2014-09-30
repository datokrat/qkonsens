import Common = require('factories/common')

export class Factory<T> implements Common.Factory<T> {
	constructor(construct: { new(): T }) {
		this.create = () => new construct();
	}
	
	public create: () => T;
}

export class ControllerFactory<Model, ViewModel, Controller> {
	constructor(construct: { new(m: Model, v: ViewModel): Controller }) {
		this.create = (m: Model, v: ViewModel) => new construct(m, v);
	}
	
	public create: (m: Model, v: ViewModel) => Controller;
}

export class ControllerFactoryEx<Model, ViewModel, Communicator, Controller> {
	constructor(construct: { new(m: Model, v: ViewModel, c: Communicator): Controller }, communicator: Communicator) {
		this.communicator = communicator;
		this.create = (m: Model, v: ViewModel) => new construct(m, v, this.communicator);
	}
	
	private communicator: Communicator;
	public create: (m: Model, v: ViewModel) => Controller;
}