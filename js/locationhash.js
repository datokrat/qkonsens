define(["require", "exports", 'event'], function (require, exports, Evt) {
    var changeEventEnabled = true;
    var hashVal = null;
    function setHashVal(val) {
        return hashVal = val;
    }
    var LocationHash = (function () {
        function LocationHash() {
        }
        LocationHash.get = function () {
            return location.hash;
        };
        LocationHash.set = function (hash, raiseEvent) {
            if (raiseEvent === void 0) { raiseEvent = true; }
            location.hash = setHashVal(hash);
        };
        LocationHash.changed = new Evt.EventImpl();
        return LocationHash;
    })();
    hashVal = LocationHash.get();
    $(function () {
        $(window).hashchange(function () {
            var newHash = LocationHash.get().slice(1);
            if (hashVal != newHash) {
                setHashVal(newHash);
                LocationHash.changed.raise(LocationHash.get());
            }
        });
    });
    return LocationHash;
});
