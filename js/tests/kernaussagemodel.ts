import unit = require('tests/tsunit')
import test = require('tests/test')

import kaModel = require('../kernaussagemodel')

export class Tests extends unit.TestClass {
	private factory = new KernaussageFactory();

	test() {
		var ka = this.factory.create( 'Begriff Basisdemokratie' );
	}
}

class KernaussageFactory {
	public create(title: string) {
		var kernaussage = new kaModel.Model();
		kernaussage.title(title);
		return kernaussage;
	}
}