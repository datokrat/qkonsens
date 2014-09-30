///<reference path='../typings/disco.d.ts' />
define(["require", "exports", 'disco'], function(require, exports, disco) {
    var discoContext = new disco.Context('http://test.disco-network.org/api/odata/');
    
    return discoContext;
});
