import KElement = require('kelement');
import Content = require('contentmodel');

export class OpenEditKElementWindowCommand {
	constructor(public model: KElement.Model) {}
}

export class UpdateGeneralContentCommand {
	constructor(public content: Content.General, public callbacks: { then: () => void }) {}
}

export class UpdateContextCommand {
	constructor(public content: Content.Context, public callbacks: { then: () => void }) {}
}