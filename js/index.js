define(["require", "exports", "index.mediator", "index.model", "index.viewmodel", "eventmgr"], function(require, exports, mediator, model, viewmodel, eventmgr) {
    infuser.defaults.templateUrl = 'templates';

    var cxt = { emgr: null, mtr: null, mdl: null, vm: null };

    var emgr = new eventmgr.EventMgr();
    cxt.emgr = emgr;

    var mtr = new mediator.DiscoMediator(discoUri, cxt);
    cxt.mtr = mtr;

    var mdl = new model.Model(mtr);
    cxt.mdl = mdl;

    var vm = new viewmodel.ViewModel(mdl, emgr);
    cxt.vm = vm;

    mdl.kk(new model.KonsenskisteImpl());
    mdl.selectTopic(new model.Topic(1), model.TopicRole.Child);
    ko.applyBindings(vm);

    emgr.kkNeeded({ id: 12, out: mdl.kk() });
    emgr.topicNeeded({ id: 1, out: mdl.topic() });

    globalVm = vm;
});
