import unit = require('tests/tsunit')
import test = require('tests/test')
import reloader = require('frontendtests/reloader')

import webot = require('frontendtests/webot')
import common = require('../common')

import mdl = require('model')
import vm = require('viewmodel')
import ctr = require('controller')

import Comment = require('comment')
import koki = require('konsenskistemodel')
import ka = require('kernaussagemodel')

import TestCommunicator = require('tests/testcommunicator')

declare var x;
ko = top.frames[2].ko;

export class Tests {
	private webot = new webot.Webot;
	
	setUp(r) {
		var model: mdl.Model = reloader.model();
		var viewModel: vm.ViewModel = reloader.viewModel();
		var controller: ctr.Controller = reloader.controller();
		var communicator = reloader.communicator();
		
		var konsenskiste = new koki.Model;
		konsenskiste.id = 1;
		konsenskiste.general().title('Konsenskisten-Titel');
		konsenskiste.general().text('Lorem ipsum dolor sit amet');
		konsenskiste.context().text('ipsum (lat.): selbst');
		
		var kernaussage = new ka.Model();
		konsenskiste.childKas.push(kernaussage);
		
		model.konsenskiste(konsenskiste);
		
		kernaussage.id = 2;
		kernaussage.general().title('Kernaussagen-Titel');
		kernaussage.general().text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.');
		kernaussage.context().text('blablablablub');
		setTimeout(r, 0);
	}

	testTitle(cxt, r) {
		test.assert( () => this.webot.query('h1').text('Konsenskiste').exists() );
		r();
	}

	testDocumentView(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.webot.query('*').text('wechseln').click();
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.webot.query('*').text('Dokumentansicht').exists() );
				test.assert( () => this.webot.query('*').text('Detailansicht').exists(false) );
				this.webot.queryContains('a', 'wechseln').click();
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.webot.query('*').text('Detailansicht').exists() );
				test.assert( () => this.webot.query('*').text('Dokumentansicht').exists(false) );
				r();
			}
		], err => { console.log(err); r(err) });
	}
	
	testKokiContent(cxt, r) {
		test.assert( () => this.webot.query('h1').text('Konsenskisten-Titel').exists() );
		test.assert( () => this.webot.query('*').text('Lorem ipsum dolor sit amet').exists() );
		r();
	}
	
	testKokiContext(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('Klärtext aufklappen').click();
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists() );
				this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').click();
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists(false) );
				r();
			}
		], r);
	}
	
	testKaContext(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('Klärtext aufklappen').click();
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists() );
		
				this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').click();
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists(false) );
				r();
			}
		], r);
	}
	
	testKaContent(cxt, r) {
		test.assert( () => this.webot.query('h1').text('Kernaussagen-Titel').exists() );
		test.assert( () => this.webot.query('*').text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.').exists() );
		r();
	}
	
	testCommunicator(cxt, r) {
		common.Callbacks.batch([
			r => {
				var model = reloader.model();
				var oldKoki = new koki.Model;
				oldKoki.id = 15;
				model.konsenskiste(oldKoki);
				
				var newKoki = new koki.Model;
				newKoki.id = 15;
				newKoki.general().title('New Title');
				newKoki.general().text('New Text');
				
				var com = reloader.communicator();
				com.konsenskiste.received.raise({id: 15, konsenskiste: newKoki });
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.webot.query('h1').text('New Title').exists() );
				test.assert( () => this.webot.query('*').text('New Text').exists() );
				test.assert( () => this.webot.query('*').text('Klärtext aufklappen').exists(false) );
				r();
			}
		], r);
	}
	
	konsenskisteComments(cxt, r) {
		common.Callbacks.batch([
			r => {
				var model = reloader.model();
				var communicator = reloader.communicator();
				var serverModel = new koki.Model();
				serverModel.id = 1;
				var comment = new Comment.Model();
				comment.content().text('Comment');
				serverModel.comments.set([comment]);
				communicator.konsenskiste.setTestKoki(serverModel);
				setTimeout(r, 0);
			},
			r => {
				this.webot.query('.kk>.controls').child('*').contains('Diskussion').click();
				setTimeout(r, 100);
			},
			r => {
				test.assert( () => this.webot.query('.cmt').child('*').text('Comment').exists() );
				r();
			}
		], r);
	}
	
	kernaussageComments(cxt, r) {
		common.Callbacks.batch([
			r => {
				var model = reloader.model();
				var communicator = reloader.communicator();
				var serverKa = new ka.Model();
				serverKa.id = 2;
				var comment = new Comment.Model();
				comment.content().text('Comment');
				serverKa.comments.set([comment]);
				communicator.konsenskiste.kernaussage.setTestKa(serverKa);
				setTimeout(r);
			},
			r => {
				this.webot.query('.ka>.controls').child('*').contains('Diskussion').click();
				setTimeout(r, 100);
			},
			r => {
				test.assert( () => this.webot.query('.cmt').child('*').text('Comment').exists() );
				r();
			}
		], r);
	}
}