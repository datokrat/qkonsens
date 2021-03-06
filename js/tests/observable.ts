import unit = require('tests/tsunit')
import test = require('tests/test')

import Obs = require('../observable')

export class Tests extends unit.TestClass {
	test() {
		var o = new Obs.ObservableArrayExtender(ko.observableArray<number>());
		var ctr = 0;
		o.pushed.subscribe(num => test.assert( () => ctr++ == 0 ));
		o.push(1);
		test.assert( () => ctr == 1 );
	}
	
	removeMany() {
		var arr = new Obs.ObservableArrayExtender(ko.observableArray<number>([1,2]));
		arr.removeMany(1);
		test.assert(() => arr.get(-1) == 1);
	}
}