import mdl = require('../model')
import vm = require('../viewmodel')
import ctr = require('../controller')
import com = require('../communicator')

var koTypes = ko;
var ko = top.frames[2].ko;
top.frames[2].infuser.defaults.templateUrl = "templates";

var page: KnockoutObservable<vm.ViewModel> = ko.observable();
var model: KnockoutObservable<mdl.Model> = ko.observable();
var controller: KnockoutObservable<ctr.Controller> = ko.observable();
var communicator: KnockoutObservable<com.Main> = ko.observable();

try {
	ko.applyBindings({ page: page });
}
catch(e) {}

var exportVar = { viewModel: page, controller: controller, model: model, communicator: communicator };
export = exportVar;