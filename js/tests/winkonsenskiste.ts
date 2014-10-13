import unit = require('tests/tsunit')
import test = require('tests/test')

import kokiMdl = require('../konsenskistemodel')
import win = require('windows/konsenskiste')
import ctr = require('windows/konsenskistecontroller')
import KokiCommunicator = require('tests/testkonsenskistecommunicator')
import ViewModelContext = require('../viewmodelcontext');

import kaMdl = require('../kernaussagemodel')

export class Tests extends unit.TestClass {
	testKkView() {
		var koki = new kokiMdl.Model;
		var window = new win.Win;
		var controller = new ctr.Controller(koki, window, new KokiCommunicator);
		
		koki.general().title('Title')
		
		test.assert( () => window.kkView().general().title() == 'Title' );
		test.assert( () => window.kkView().childKas != null );
	}
	
	testSetKonsenskisteModel() {
		var modelOld = new kokiMdl.Model;
		var modelNew = new kokiMdl.Model;
		var window = new win.Win;
		var controller = new ctr.Controller(modelOld, window, new KokiCommunicator);
		
		var currentTitle = ko.computed<string>( () => window.kkView().general().title() );
		
		modelOld.general().title('Alt');
		modelNew.general().title('Neu');
		controller.setKonsenskisteModel(modelNew);
		test.assert( () => currentTitle() == 'Neu' );
		modelNew.general().title('Basisdemokratie');
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
		koki.childKas.push(ka);
		
		koki.general().title('Basisdemokratie');
		ka.general().title('Begriff Basisdemokratie');
		ka.general().text('Blablablablub');
		
		test.assert( () => window.kkView().general().title() == 'Basisdemokratie' );
		test.assert( () => window.kkView().childKas().length == 1 );
		test.assert( () => window.kkView().childKas()[0].general().title() == 'Begriff Basisdemokratie' );
		test.assert( () => window.kkView().childKas()[0].general().text() == 'Blablablablub' );
	}
    
    contextImplementation() {
        var koki = new kokiMdl.Model();
		var window = new win.Win();
		var controller = new ctr.Controller(koki, window, new KokiCommunicator);
		controller.setContext(new ViewModelContext(null, null, null));
		
		test.assert( () => controller['konsenskisteController']['cxt'] );
    }
}