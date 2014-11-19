import Topic = require('../topic');

export class Main {
	public static create(args: { title?: string; text: string; id: number }): Topic.Model {
		var ret = new Topic.Model();
		ret.id = args.id;
		ret.title(args.title);
		ret.title(args.text);
		return ret;
	}
}