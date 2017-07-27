'use strict';

function StateMachineSystem(stateMap) {
	this.name = 'statemachine';
	this.stateMap = stateMap;
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities) {
    var fsmComp = smx.fsm(entity);

    if (fsmComp) {
      var fsm = this.stateMap[fsmComp.fsmName];
      if (!fsmComp.currentState) {
        fsmComp.currentState = fsm.states[0];
      }

      var currentState = fsmComp.currentState;

      fsmComp.stateTime += delta;
      fsm[currentState].update(fsmComp.stateTime, function (nextState) { // Shift
        fsm[currentState].exit();
        fsmComp.stateTime = 0;
        fsmComp.currentState = nextState;
        // TODO: Replace this with a permissioned call to the entity components
        fsm[nextState].enter(entity.components);
      });

      sm.gfx.text(
          sm.utils.formatters.float_one_pt(fsmComp.stateTime),
          0, 64
      );
    }
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
