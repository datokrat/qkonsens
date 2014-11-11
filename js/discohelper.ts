//this is not ready
import discoContext = require('discocontext');

export class DiscoHelper {
	public static post() {
		return PostHelper;
	}
}

export class PostHelper {
	public static querySingle(id: number) {
		discoContext.Posts.first(function(it) { return it.Id == this.id }, { id: id })
			.fail(HelperOptions.onError);
	}
}

class HelperOptions {
	public static onError() {
		discoContext['stateManager'].reset();
	}
}

export interface Promise<T> {
	then: (result: T) => Promise<T>;
	fail: (error: any) => Promise<T>;
}