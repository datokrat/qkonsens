import unit = require('tests/tsunit')
import test = require('tests/test')
import reloader = require('frontendtests/reloader')

import webot = require('frontendtests/webot')
import common = require('../common')

import mdl = require('model')
import vm = require('viewmodel')
import ctr = require('controller')

import Comment = require('comment')
import KonsenskisteModel = require('konsenskistemodel')
import KernaussageModel = require('kernaussagemodel')

import TestCommunicator = require('tests/testcommunicator')

declare var x;
declare var ko;
ko = top.frames[2].ko;

export class Tests {
	private webot = new webot.Webot();
	private helper: Helper;
	
	setUp(r) {
		this.helper = new Helper(this.webot);
		
		var model: mdl.Model = reloader.model();
		var viewModel: vm.ViewModel = reloader.viewModel();
		var controller: ctr.Controller = reloader.controller();
		var communicator = reloader.communicator();
		
		var konsenskiste = new KonsenskisteModel.Model;
		konsenskiste.id(1);
		konsenskiste.general().title('Konsenskisten-Titel');
		konsenskiste.general().text('Lorem ipsum dolor sit amet');
		konsenskiste.context().text('ipsum (lat.): selbst');
		
		var kernaussage = new KernaussageModel.Model();
		konsenskiste.childKas.push(kernaussage);
		
		model.konsenskiste(konsenskiste);
		
		kernaussage.id(2);
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
				setTimeout(r, 100);
			},
			r => {
				//following workaround necessary so that view is reset to 'detail' ("wechseln")
				var test1 = this.webot.query('*').text('Dokumentansicht').exists();
				var test2 = this.webot.query('*').text('Konsenskisten-Titel').exists();
				var test3 = this.webot.query('p').contains('consetetur sadipscing elitr').exists();
				var test4 = this.webot.query('*').text('Detailansicht').exists(false);
				this.webot.queryContains('a', 'wechseln').click();
				test.assert(() => test1);
				test.assert(() => test2);
				test.assert(() => test3);
				test.assert(() => test4);
				setTimeout(r, 0);
			},
			r => {
				test.assert( () => this.webot.query('*').text('Detailansicht').exists() );
				test.assert( () => this.webot.query('*').text('Dokumentansicht').exists(false) );
				r();
			}
		], (err?: any) => { r(err) });
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
				var oldKoki = new KonsenskisteModel.Model;
				oldKoki.id(15);
				model.konsenskiste(oldKoki);
				
				var newKoki = new KonsenskisteModel.Model;
				newKoki.id(15);
				newKoki.general().title('New Title');
				newKoki.general().text('New Text');
				
				var com = reloader.communicator();
				com.konsenskiste.received.raise({id: 15, konsenskiste: newKoki });
				setTimeout(r);
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
				
				var serverModel = new KonsenskisteModel.Model();
				serverModel.id(1);
				var comment = new Comment.Model();
				comment.content().text('Comment');
				serverModel.discussion().comments.set([comment]);
				communicator.konsenskiste.setTestKoki(serverModel);
				setTimeout(r, 0);
			},
			r => {
				this.webot.query('.kk>.controls').child('*').contains('Diskussion').click();
				setTimeout(r, 300);
			},
			r => {
				test.assert( () => this.webot.query('.cmt').child('*').text('Comment').exists() );
				r();
			}
		], r);
	}
	
	kernaussageComments(cxt, r) {
		var serverKa = new KernaussageModel.Model();
		common.Callbacks.batch([
			r => {
				var model = reloader.model();
				var communicator = reloader.communicator();
				serverKa.id(2);
				var comment = new Comment.Model();
				comment.content().text('Comment');
				serverKa.discussion().comments.set([comment]);
				communicator.konsenskiste.kernaussage.setTestKa(serverKa);
				setTimeout(r);
			},
			r => {
				this.webot.query('.ka>.controls').child('*').contains('Diskussion').click();
				setTimeout(r, 100);
			},
			r => {
				test.assert( () => this.webot.query('.cmt').child('*').text('Comment').exists() );
				
				var comment2 = new Comment.Model();
				comment2.content().text('Comment2');
				serverKa.discussion().comments.push(comment2);
				this.webot.query('.ka>.controls').child('*').contains('Diskussion').click();
				setTimeout(r, 100);
			},
			r => {
				test.assert( () => this.webot.query('.cmt').child('*').text('Comment2').exists(false) );
				r();
			}
		], r);
	}
	
	commentsLoading(cxt, r) {
		var model = reloader.model();
		common.Callbacks.batch([
			r => {
				this.webot.query('.kk>.controls').child('*').contains('Diskussion').click();
				setTimeout(r);
			},
			r => {
				model.konsenskiste().discussion().commentsLoading(true);
				setTimeout(r);
			},
			r => {
				test.assert( () => this.webot.query(':contains("Diskussion")').child('*').text('Laden...').exists() );
				r();
			}
		], r);
	}
	
	rating(cxt, r) {
		var ratingButtons = this.webot.query('.kk>.controls .rating input[type="radio"]');
		var ratingLabels = this.webot.query('.kk>.controls .rating input[type="radio"] ~ label');
		
		common.Callbacks.batch([
			r => {
				test.assert( () => ratingLabels.contains('?').exists() );
				
				var stronglikeLabel = ratingLabels.contains('++');
				test.assert( () => stronglikeLabel.exists() );
				
				stronglikeLabel.click();
				setTimeout(r, 100);
			},
			r => {
				var stronglikeButton = ratingButtons.contains('++');
				test.assert( () => this.webot.query('.kk>.controls .rating input[type="radio"]:checked ~ label').contains('++').exists() );
				r();
			}
		], r);
	}
	
	newKaButtonExists(cxt, r) {
		var newKaButton = this.helper.getNewKaButton();
		
		test.assert(() => newKaButton.exists());
		r();
	}
	
	newKa(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.helper.getNewKaButton().click();
				setTimeout(r);
			},
			r => {
				test.assert(() => this.helper.isNewKaFormVisible());
				r();
			}
		], r);
	}
	
	doubleClickNewKa(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.helper.getNewKaButton().click();
				this.helper.getNewKaButton().click();
				setTimeout(r);
			},
			r => {
				test.assert(() => !this.helper.isNewKaFormVisible());
				r();
			}
		], r);
	}
	
	submitNewKa(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.helper.getNewKaButton().click();
				setTimeout(r);
			},
			r => {
				this.helper.submitNewKa();
				setTimeout(r);
			},
			r => {
				test.assert(() => this.helper.isNewKaSubmitted());
				this.helper.openDiscussionOfNewKa();
				setTimeout(r);
			},
			r => {
				test.assert(() => this.helper.isNewKaDiscussionVisible());
				r();
			}
		], r);
	}
	
	history(cxt, r) {
		var communicator = reloader.communicator().konsenskiste;
		var viewModel = reloader.viewModel();
		
		var koki1 = new KonsenskisteModel.Model();
		koki1.id(123);
		koki1.general().text('This is Post #123');
		communicator.setTestKoki(koki1);
		var koki2 = new KonsenskisteModel.Model();
		koki2.id(246);
		koki2.general().text('This is Post #246');
		communicator.setTestKoki(koki2);
		
		common.Callbacks.batch([
			r => {
				viewModel.center.win().setState({ kokiId: 123 });
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('*').text('This is Post #123').exists());
				viewModel.center.win().setState({ kokiId: 246 });
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('*').text('This is Post #246').exists());
				this.webot.query('.win').contains('This is Post #246').child('h1').contains('Konsenskiste').child('*').text('<<').click();
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('*').text('This is Post #123').exists());
				r();
			}
		], r);
	}
	
	permaLink(cxt, r) {
		var hash = JSON.parse(location.hash.slice(1));
		test.assert(() => hash.kokiId == 1);
		r();
	}
	
	changePermaLink(cxt, r) {
		var com = reloader.communicator();
		var testKoki = new KonsenskisteModel.Model();
		testKoki.id(111);
		testKoki.general().title('KoKi #111');
		com.konsenskiste.setTestKoki(testKoki);
		
		common.Callbacks.batch([
			r => {
				location.hash = '{ "kokiId": 111 }';
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('*').text('KoKi #111').exists());
				r();
			}
		], r);
	}
	
	initialRatings(cxt, r) {
		common.Callbacks.batch([
			r => {
				var serverKa = new KernaussageModel.Model();
				serverKa.rating().personalRating('dislike');
				var serverKoki = new KonsenskisteModel.Model();
				serverKoki.id(592);
				serverKoki.rating().personalRating('strongdislike');
				serverKoki.childKas.push(serverKa);
				
				var com = reloader.communicator();
				com.konsenskiste.setTestKoki(serverKoki);
				
				var koki = new KonsenskisteModel.Model();
				koki.id(592);
				reloader.model().konsenskiste(koki);
				
				com.konsenskiste.queryKoki(592);
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('.kk>.controls .rating input[type="radio"]:checked ~ label').text('--').exists());
				test.assert(() => this.webot.query('.ka>.controls .rating input[type="radio"]:checked ~ label').text('-').exists());
				r();
			}
		], r);
	}
	
	appendComment(cxt, r) {
		common.Callbacks.batch([
			r => {
				this.webot.query('.kk>.controls').child('*').contains('Diskussion').click();
				setTimeout(r);
			},
			r => {
				this.webot.query('.win').child('form').contains('Beitrag abschicken').child('textarea').$().val('This is a comment').change();
				this.webot.query('.win').child('form').child('button').contains('Beitrag abschicken').click();
				setTimeout(r);
			},
			r => {
				test.assert(() => this.webot.query('.win').child('.cmt:not(:contains("Beitrag abschicken"))').child('*').text('This is a comment').exists());
				r();
			}
		], r);
	}
}

class Helper {
	constructor(private webot: webot.Webot) {}
	
	public getNewKaButton(): webot.WebotElement {
		return this.webot.query('.kk *').text('+Kernaussage');
	}
	
	public isNewKaFormVisible(): boolean {
		return this.webot.query('.kk').child('.ka').contains('Anfügen').exists();
	}
	
	public submitNewKa() {
		var form = this.webot.query('.kk').child('.ka').contains('Anfügen');
		form.child('.title input[type=text]').$().val('Title').change();
		form.child('.text textarea').$().val('Text').change();
		form.child('button').text('Anfügen').click();
	}
	
	public isNewKaSubmitted(): boolean {
		var ka = this.webot.query('.kk').child('.ka').contains('Diskussion');
		var form = this.webot.query('.kk').child('.ka').contains('Anfügen');
		return ka.contains('Title').contains('Text').exists() && form.exists(false);
	}
	
	public openDiscussionOfNewKa() {
		var ka = this.webot.query('.kk').child('.ka').contains('Diskussion').contains('Title').contains('Text');
		ka.child('*').text('Diskussion').click();
	}
	
	public isNewKaDiscussionVisible(): boolean {
		var discussion = this.webot.query('.win').child('h1:contains("Diskussion") ~ *');
		return discussion.contains('Text').exists() && discussion.contains('Title').exists()
			&& !discussion.contains('Fehler').exists();
	}
}