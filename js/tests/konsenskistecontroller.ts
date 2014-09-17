import unit = require('tests/tsunit')
import test = require('tests/test')

import kkModelFty = require('factories/konsenskistemodel')
import kaModelFty = require('factories/kernaussagemodel')

import mdl = require('../konsenskistemodel')
import vm = require('../konsenskisteviewmodel')
import ctr = require('../konsenskistecontroller')
import KokiCommunicator = require('tests/testkonsenskistecommunicator')

import Event = require('../event')
import EventFactory = require('../factories/event')

export class Tests extends unit.TestClass {
	private kkModelFactory = new kkModelFty.Factory().setEventFactory(new TestEventFactory);
	private kaModelFactory = new kaModelFty.Factory();
	
	testContent() {
		var model = this.kkModelFactory.create( 'Basisdemokratie', 'Beschreibung' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator);
		
		model.content().context().text('Der Klärtext');
		
		test.assert( () => viewModel.content().title() == 'Basisdemokratie' );
		test.assert( () => viewModel.content().text() == 'Beschreibung' );
		test.assert( () => viewModel.content().context().text() == 'Der Klärtext' );
	}
	
	testContentObservables() {
		var model = this.kkModelFactory.create( 'Basisdemokratie', 'Beschreibung' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator);
		var titleTracker: string[] = [];
		var textTracker: string[] = [];
		
		viewModel.content().title.subscribe( newTitle => {
			titleTracker.push(newTitle);
		} );
		viewModel.content().text.subscribe( newText => {
			textTracker.push(newText);
		} );
		model.content().title('New Title');
		model.content().text('New Text');
		
		test.assert( () => titleTracker.length == 1 );
		test.assert( () => titleTracker[0] == 'New Title' );
		test.assert( () => textTracker.length == 1 );
		test.assert( () => textTracker[0] == 'New Text' );
	}

	testChildKas() {
		var model = this.kkModelFactory.create( 'Basisdemokratie (Konzept)', 'Beispiel-Konsenskiste' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator);
		
		model.appendKa( this.kaModelFactory.create('Begriff Basisdemokratie') );
		
		test.assert(() => viewModel.childKas()[0].content().title() == 'Begriff Basisdemokratie');
		test.assert(() => viewModel.childKas().length == 1);
		test.assert(() => !viewModel.childKas()[0].isActive());
	}
	
	testRemoveChildKa() {
		var model = this.kkModelFactory.create( 'Basisdemokratie (Konzept)' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator);
		var ka = this.kaModelFactory.create('Begriff Basisdemokratie');
		
		model.appendKa( ka );
		model.removeKa( ka );
		
		test.assert(() => viewModel.childKas().length == 0);
	}
	
	testDispose() {
		var model = this.kkModelFactory.create( 'Basisdemokratie' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator);
		
		controller.dispose();
		
		var inserted = < TestEvent<mdl.ChildKaEventArgs> > model.childKaInserted;
		var removed = < TestEvent<mdl.ChildKaEventArgs> > model.childKaRemoved;
		
		model.appendKa( this.kaModelFactory.create('Test') );
		
		test.assert( () => inserted.countListeners() == 0 );
		test.assert( () => removed.countListeners() == 0 );
		
		test.assert( () => viewModel.content().title() == 'Basisdemokratie' );
	}
	
	/* testSetModel() {
		var oldModel = this.kkModelFactory.create( 'Old' );
		var newModel = this.kkModelFactory.create( 'New' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(oldModel, viewModel);
		
		controller.setModel(newModel);
		
		test.assert( () => viewModel.content().title() == 'New' );
		newModel.content.title( 'Basisdemokratie' );
		test.assert( () => viewModel.content().title() == 'Basisdemokratie' );
	} */
	
	/* testContentAfterSetModel() {
		var oldModel = this.kkModelFactory.create( 'Old' );
		var newModel = this.kkModelFactory.create( 'New' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(oldModel, viewModel);
		var contentVm = viewModel.content;
		
		controller.setModel(newModel);
		
		test.assert( () => contentVm().title() == 'New' );
	} */
	
	/*testNullModel() {
		var viewModel = new vm.ViewModel();
		
		var controller = new ctr.Controller(null, viewModel);
		controller.dispose();
	}*/
}

class TestEvent<Args> implements Event.Event<Args> {
	private event = new Event.EventImpl<Args>();
	
	constructor() {
		this.raiseThis = this.raise.bind(this);
	}
	
	public subscribe(cb: Event.Listener<Args>): Event.Subscription {
		this.listenerCtr++;
		this.event.subscribe(cb);
		return { undo: () => this.unsubscribe(cb) };
	}
	
	public unsubscribe(cb: Event.Listener<Args>): void {
		this.listenerCtr--;
		this.event.unsubscribe(cb);
	}
	
	public raise(args?: Args) {
		this.event.raise(args);
	}
	
	public raiseThis: (args?: Args) => void;
	
	public countListeners(): number {
		return this.listenerCtr;
	}
	
	private listenerCtr = 0;
}

class TestEventFactory {
	public create<Args>() {
		return new TestEvent<Args>();
	}
}