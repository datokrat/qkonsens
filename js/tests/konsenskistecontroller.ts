import unit = require('tests/tsunit')
import test = require('tests/test')

import kkModelFty = require('factories/konsenskistemodel')
import kaModelFty = require('factories/kernaussagemodel')

import mdl = require('../konsenskistemodel')
import vm = require('../konsenskisteviewmodel')
import ctr = require('../konsenskistecontroller')

import Event = require('../event')
import EventFactory = require('../factories/event')

export class Tests extends unit.TestClass {
	private kkModelFactory = new kkModelFty.Factory().setEventFactory(new TestEventFactory);
	private kaModelFactory = new kaModelFty.Factory();
	
	testContent() {
		var model = this.kkModelFactory.create( 'Basisdemokratie', 'Beschreibung' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		
		test.assert( () => viewModel.content.title() == 'Basisdemokratie' );
		test.assert( () => viewModel.content.text() == 'Beschreibung' );
	}

	testChildKas() {
		var model = this.kkModelFactory.create( 'Basisdemokratie (Konzept)', 'Beispiel-Konsenskiste' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		
		model.appendKa( this.kaModelFactory.create('Begriff Basisdemokratie') );
		
		test.assert(() => viewModel.childKas()[0].content.title() == 'Begriff Basisdemokratie');
		test.assert(() => viewModel.childKas().length == 1);
		test.assert(() => !viewModel.childKas()[0].isActive());
	}
	
	testRemoveChildKa() {
		var model = this.kkModelFactory.create( 'Basisdemokratie (Konzept)' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		var ka = this.kaModelFactory.create('Begriff Basisdemokratie');
		
		model.appendKa( this.kaModelFactory.create('Begriff Basisdemokratie') );
		model.removeKa( this.kaModelFactory.create('Begriff Basisdemokratie') );
		
		test.assert(() => viewModel.childKas().length == 0);
	}
	
	testDispose() {
		var model = this.kkModelFactory.create( 'Basisdemokratie' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.Controller(model, viewModel);
		
		controller.dispose();
		
		test.assert( () => viewModel.content.title == null );
		test.assert( () => viewModel.content.text == null );
		test.assert( () => viewModel.childKas == null );
		
		var inserted = < TestEvent<mdl.ChildKaEventArgs> > model.childKaInserted;
		var removed = < TestEvent<mdl.ChildKaEventArgs> > model.childKaRemoved;
		
		test.assert( () => inserted.countListeners() == 0 );
		test.assert( () => removed.countListeners() == 0 );
	}
}

class TestEvent<Args> implements Event.Event<Args> {
	private event = new Event.EventImpl<Args>();
	
	public subscribe(cb: Event.Listener<Args>): Event.Subscription {
		this.listenerCtr++;
		this.event.subscribe(cb);
		return { undo: () => this.unsubscribe(cb) };
	}
	
	public unsubscribe(cb: Event.Listener<Args>): void {
		this.listenerCtr--;
		this.event.unsubscribe(cb);
	}
	
	public raise(args: Args) {
		this.event.raise(args);
	}
	
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