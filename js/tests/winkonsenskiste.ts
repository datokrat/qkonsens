import unit = require('tests/tsunit')
import test = require('tests/test')

import kokiMdl = require('../konsenskistemodel')
import win = require('windows/konsenskiste')
import ctr = require('windows/konsenskistecontroller')
import KokiCommunicator = require('tests/testkonsenskistecommunicator')

import kaMdl = require('../kernaussagemodel')

export class Tests extends unit.TestClass {
	testKkView() {
		var koki = new kokiMdl.Model;
		var window = new win.Win;
		var controller = new ctr.Controller(koki, window, new KokiCommunicator);
		
		koki.content.title('Title')
		
		test.assert( () => window.kkView().content().title() == 'Title' );
		test.assert( () => window.kkView().childKas != null );
	}
	
	testSetKonsenskisteModel() {
		var modelOld = new kokiMdl.Model;
		var modelNew = new kokiMdl.Model;
		var window = new win.Win;
		var controller = new ctr.Controller(modelOld, window, new KokiCommunicator);
		
		var currentTitle = ko.computed<string>( () => window.kkView().content().title() );
		
		modelOld.content.title('Alt');
		modelNew.content.title('Neu');
		controller.setKonsenskisteModel(modelNew);
		test.assert( () => currentTitle() == 'Neu' );
		modelNew.content.title('Basisdemokratie');
		test.assert( () => currentTitle() == 'Basisdemokratie' );
	}
	
	testNullModel() {
		var window = new win.Win;
		var controller = new ctr.Controller(null, window, new KokiCommunicator);
	}
	
	testAComplexUseCase() {
		var koki = new kokiMdl.Model;
		var window = new win.Win;
		var controller = new ctr.Controller(koki, window, new KokiCommunicator);
		
		var ka = new kaMdl.Model();
		koki.appendKa(ka);
		
		koki.content.title('Basisdemokratie');
		ka.content.title('Begriff Basisdemokratie');
		ka.content.text('Blablablablub');
		
		test.assert( () => window.kkView().content().title() == 'Basisdemokratie' );
		test.assert( () => window.kkView().childKas().length == 1 );
		test.assert( () => window.kkView().childKas()[0].content().title() == 'Begriff Basisdemokratie' );
		test.assert( () => window.kkView().childKas()[0].content().text() == 'Blablablablub' );
	}
}