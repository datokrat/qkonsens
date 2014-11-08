import Evt = require('event');

var changeEventEnabled = true;
var hashVal = null;

function setHashVal(val: string): string {
	return hashVal = val;
}

class LocationHash {
	public static changed = new Evt.EventImpl<string>();
	public static get(): string {
		return location.hash;
	}
	public static set(hash: string, raiseEvent = true) {
		location.hash = setHashVal(hash);
	}
}

hashVal = LocationHash.get();

$(() => {$(window).hashchange(() => {
	var newHash = LocationHash.get().slice(1);
	if(hashVal != newHash) {
		setHashVal(newHash);
		LocationHash.changed.raise(LocationHash.get());
	}
})});

export = LocationHash;