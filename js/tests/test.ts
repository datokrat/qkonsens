export class TestErrorBase {
	public toString(): string {
		return JSON.stringify(this);
	}
}

export class TestError extends TestErrorBase {
	constructor(message: string) {
		super();
		this.message = message;
	}
	
	public toString() {
		return "TestError: " + this.message;
	}
	
	public message: string;
}

export function assert(condition: () => boolean) {
	if(!condition()) throw new TestError("assert: " + getFnBody(condition));
}

export function assertThrows(action: () => void) {
	var throwed = false;
	try {
		action();
	}
	catch(e) {
		throwed = true;
	}
	if(!throwed)
		throw new TestError("assertThrows");
}

function getFnBody(fn: () => boolean) {
	var str = fn.toString();
	return str.substr(37, str.length - 52) //.substr(21, str.length - 23)
}