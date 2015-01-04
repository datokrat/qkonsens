import unit = require('tests/tsunit')
import test = require('tests/test')

import kkModelFty = require('factories/konsenskistemodel')
import kaModelFty = require('factories/kernaussagemodel')
import KernaussageModel = require('../kernaussagemodel')

import mdl = require('../konsenskistemodel')
import vm = require('../konsenskisteviewmodel')
import ctr = require('../konsenskistecontroller')
import ContentModel = require('../contentmodel')
import Rating = require('../rating')
import Comment = require('../comment')
import KokiCommunicator = require('tests/testkonsenskistecommunicator')

import Event = require('../event')
import EventFactory = require('../factories/event')

export class Tests extends unit.TestClass {
	private kkModelFactory = new kkModelFty.Factory().setEventFactory(new TestEventFactory);
	private kaModelFactory = new kaModelFty.Factory();
	
	testContent() {
		var model = this.kkModelFactory.create( 'Basisdemokratie', 'Beschreibung' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator.Main);
		
		model.context().text('Der Klärtext');
		
		test.assert( () => viewModel.general().title() == 'Basisdemokratie' );
		test.assert( () => viewModel.general().text() == 'Beschreibung' );
		test.assert( () => viewModel.context().text() == 'Der Klärtext' );
	}
	
	testContentObservables() {
		var model = this.kkModelFactory.create( 'Basisdemokratie', 'Beschreibung' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator.Main);
		var titleTracker: string[] = [];
		var textTracker: string[] = [];
		
		viewModel.general().title.subscribe( newTitle => {
			titleTracker.push(newTitle);
		} );
		viewModel.general().text.subscribe( newText => {
			textTracker.push(newText);
		} );
		model.general().title('New Title');
		model.general().text('New Text');
		
		test.assert( () => titleTracker.length == 1 );
		test.assert( () => titleTracker[0] == 'New Title' );
		test.assert( () => textTracker.length == 1 );
		test.assert( () => textTracker[0] == 'New Text' );
	}

	testChildKas() {
		var model = this.kkModelFactory.create( 'Basisdemokratie (Konzept)', 'Beispiel-Konsenskiste' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator.Main);
		
		model.childKas.push( this.kaModelFactory.create('', 'Begriff Basisdemokratie') );
		
		test.assert(() => viewModel.childKas()[0].general().title() == 'Begriff Basisdemokratie');
		test.assert(() => viewModel.childKas().length == 1);
	}
	
	testRemoveChildKa() {
		var model = this.kkModelFactory.create( 'Basisdemokratie (Konzept)' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator.Main);
		var ka = this.kaModelFactory.create('', 'Begriff Basisdemokratie');
		
		model.childKas.push( ka );
		model.childKas.remove( ka );
		
		test.assert(() => viewModel.childKas().length == 0);
	}
	
	testDispose() {
		var model = this.kkModelFactory.create( 'Basisdemokratie' );
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator.Main);
		
		controller.dispose();
		
		var inserted = < TestEvent<KernaussageModel.Model> > model.childKas.pushed;
		var removed = < TestEvent<KernaussageModel.Model> > model.childKas.removed;
		
		model.childKas.push( this.kaModelFactory.create('', 'Test') );
		
		//TODO: Make this possible again
		//test.assert( () => inserted.countListeners() == 0 );
		//test.assert( () => removed.countListeners() == 0 );
		
		test.assert( () => viewModel.general().title() == 'Basisdemokratie' );
	}
	
	testRating() {
		var model = this.kkModelFactory.create('Basisdemokratie');
		var viewModel = new vm.ViewModel;
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator.Main);
		
		model.rating().personalRating('like');
		
		test.assert( () => viewModel.rating().personalRating() == 'like' );
	}
	
	testChangingFields() {
		var model = this.kkModelFactory.create('Basisdemokratie');
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator.Main);
		
		model.general().title('title');
		model.general(new ContentModel.General);
		
		model.context().text('context');
		model.context(new ContentModel.Context);
		
		model.rating().personalRating('like');
		model.rating(new Rating.Model);
		
		test.assert( () => viewModel.general().title() != 'title' );
		test.assert( () => viewModel.context().text() != 'context' );
		test.assert( () => viewModel.rating().personalRating() != 'like');
	}
	
	testComments() {
		var model = this.kkModelFactory.create('Basisdemokratie');
		var viewModel = new vm.ViewModel();
		var controller = new ctr.ControllerImpl(model, viewModel, new KokiCommunicator.Main);
		
		var comment = new Comment.Model();
		comment.content().text('A Comment');
		model.discussion().comments.push(comment);
		
		test.assert( () => viewModel.discussion().comments().length == 1 );
		test.assert( () => viewModel.discussion().comments()[0].content().text() == 'A Comment' );
	}
	
	appendKaViaCommunicator() {
		var eventCtr = 0;
		var model = this.kkModelFactory.create('Basisdemokratie');
		model.id(2);
		var viewModel = new vm.ViewModel();
		var communicator = new KokiCommunicator.Main();
		var controller = new ctr.ControllerImpl(model, viewModel, communicator);
		
		var serverKoki = this.kkModelFactory.create('Basisdemokratie');
		serverKoki.id(2);
		communicator.setTestKoki(serverKoki);
		communicator.kernaussageAppended.subscribe(() => ++eventCtr);
		
		var kernaussage = new KernaussageModel.Model();
		communicator.createAndAppendKa(model.id(), kernaussage);
		
		test.assert(() => eventCtr == 1);
	}
	
	appendKaViaCommunicator_error() {
		var errorCtr = 0;
		var successCtr = 0;
		var model = this.kkModelFactory.create('Title', 'Text', 2);
		var serverKoki = this.kkModelFactory.create('Title', 'Text', 3);
		var viewModel = new vm.ViewModel();
		var communicator = new KokiCommunicator.Main();
		var controller = new ctr.ControllerImpl(model, viewModel, communicator);
		
		communicator.setTestKoki(serverKoki);
		communicator.kernaussageAppendingError.subscribe(() => ++errorCtr);
		communicator.kernaussageAppended.subscribe(() => ++successCtr);
		
		var kernaussage = new KernaussageModel.Model();
		communicator.createAndAppendKa(model.id(), kernaussage);
		
		test.assert(() => successCtr == 0);
		test.assert(() => errorCtr == 1);
	}
}

class TestEvent<Args> implements Event.Event<Args> {
	private event = new Event.EventImpl<Args>();
	
	constructor() {
		this.raiseThis = this.raise.bind(this);
	}
	
	public subscribe(cb: Event.Listener<Args>): Event.Subscription {
		this.listenerCtr++;
		this.event.subscribe(cb);
		return { dispose: () => this.unsubscribe(cb) };
	}
	
	public subscribeUntil(cb: Event.Listener<Args>, timeout?: number): Event.Subscription {
		var subscription: Event.Subscription;
		var handler = (args: Args) => { if(cb(args)) subscription.dispose() };
		subscription = this.subscribe(handler);
		if(typeof timeout === 'number') setTimeout(() => subscription.dispose(), timeout);
		return subscription;
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