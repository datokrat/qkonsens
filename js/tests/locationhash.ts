import unit = require('tests/asyncunit');
import test = require('tests/test');
import Common = require('../common');
import LocationHash = require('../locationhash');

export class Tests extends unit.TestClass {
	change(async, r, cb) {
		async();
		var counter = new Common.Counter();
		LocationHash.reset();
		var subscription = LocationHash.changed.subscribe(hash => {
			counter.inc('changed');
		});
		
		location.hash = Math.random().toString();
		
		setTimeout(cb(() => {
			subscription.dispose();
			location.hash = '';
			test.assert(v => v.val(counter.get('changed')) == 1);
			r();
		}),500);
	}
	
	decodeCorrectly(async, r, cb) {
		async();
		var counter = new Common.Counter();
		LocationHash.reset();
		var subscription = LocationHash.changed.subscribe(hash => {
			counter.inc('changed');
			test.assert(v => v.val(hash) == '#"');
		});
		
		location.hash = '"';
		
		setTimeout(cb(() => {
			subscription.dispose();
			location.hash = '';
			test.assert(v => v.val(counter.get('changed')) == 1);
			r();
		}),500);
	}
}