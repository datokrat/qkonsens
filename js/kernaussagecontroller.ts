import observable = require('observable')

import mdl = require('kernaussagemodel')
import vm = require('kernaussageviewmodel')
import com = require('kernaussagecommunicator')
import ViewModelContext = require('viewmodelcontext')

import KSync = require('synchronizers/ksynchronizers')
import Discussable = require('discussion')

import ContentController = require('contentcontroller')
import ContentViewModel = require('contentviewmodel')

import KElement = require('kelement');

export class Controller extends KElement.Controller<mdl.Model, vm.ViewModel, com.Main> {
}