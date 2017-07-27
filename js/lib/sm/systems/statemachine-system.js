'use strict';

function StateMachineSystem(ID) {
	this.ID = ID;
	this.name = 'statemachine';
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities) {
    var fsm = smx.fsm(entity);


	};

	this.post = function () {

	};

	this.handlers = {

  };

  this.actions = {
    updateSequence: function (entity, position) {
      var seq = smx.sequence(entity);
      seq.pos = position;
    }
	};
}
