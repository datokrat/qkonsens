import Common = require('factories/common')

export class Factory<T> implements Common.Factory<T> {
	constructor(construct: { new(): T }) {
		this.create = () => new construct();
	}
	
	public create: () => T;
}