import KElement = require('kelement');

export class Model extends KElement.Model {
	
	public set(other: Model) {
		KElement.Model.prototype.set.apply(this, arguments);
	}
}