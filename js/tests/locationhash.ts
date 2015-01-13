import unit = require('tests/asyncunit');
import test = require('tests/test');
import Common = require('../common');
import LocationHash = require('../locationhash');

export class Tests extends unit.TestClass {
	change(async, r, cb) {
		async();
		var counter = new Common.Counter();
		var subscription = LocationHash.changed.subscribe(hash => {
			counter.inc('changed');
			console.log('ok');
		});
		
		location.hash = Math.random().toString();
		
		setTimeout(cb(() => {
			test.assert(v => v.val(counter.get('changed')) == 1);
			subscription.dispose();
			location.hash = '';
			r();
		}),500);
	}
}