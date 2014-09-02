import unit = require('tests/tsunit')
import test = require('tests/test')

import webot = require('frontendtests/webot')

declare var x;

export class Tests {
	private webot = new webot.Webot;

	testTitle() {
		test.assert( () => this.webot.query('h1').text('Konsenskiste').exists() );
	}

	testDocumentView() {
		this.webot.query('*').text('wechseln').click();
		
		test.assert( () => this.webot.query('*').text('Dokumentansicht').exists() );
		test.assert( () => this.webot.query('*').text('Detailansicht').exists(false) );
		
		this.webot.queryContains('a', 'wechseln').click();
		
		test.assert( () => this.webot.query('*').text('Detailansicht').exists() );
		test.assert( () => this.webot.query('*').text('Dokumentansicht').exists(false) );
	}
	
	testKokiContent() {
		test.assert( () => this.webot.query('h1').text('Konsenskisten-Titel').exists() );
		test.assert( () => this.webot.query('*').text('Lorem ipsum dolor sit amet').exists() );
	}
	
	testKokiContext() {
		this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('Klärtext aufklappen').click();
		test.assert( () => this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists() );
		
		this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').click();
		test.assert( () => this.webot.queryContains('.kk', 'Konsenskisten-Titel').child('*').text('ipsum (lat.): selbst').exists(false) );
	}
	
	testKaContext() {
		this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('Klärtext aufklappen').click();
		test.assert( () => this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists() );
		
		this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').click();
		test.assert( () => this.webot.queryContains('.ka', 'Kernaussagen-Titel').child('*').text('blablablablub').exists(false) );
	}
	
	testKaContent() {
		test.assert( () => this.webot.query('h1').text('Kernaussagen-Titel').exists() );
		test.assert( () => this.webot.query('*').text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.').exists() );
	}
}