import unit = require('tests/tsunit')
import test = require('tests/test')

import ContentModel = require('../contentmodel')

class Main extends unit.TestClass {
	testSetModel() {
		var m1 = new ContentModel.Model();
		m1.title('title1');
		m1.text('text1');
		
		var m2 = new ContentModel.Model();
		m2.title('title2');
		m2.text('text2');
		
		m1.set(m2);
		
		test.assert( () => m1.title() == 'title2' )
		test.assert( () => m1.text() == 'text2' )
	}
}

export = Main;