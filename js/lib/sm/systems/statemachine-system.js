'use strict';

function StateMachineSystem(machineMapping) {
	this.name = 'statemachine';
	this.machineMapping = machineMapping;
	
	this.pre = function () {

	};

	this.queuedTransitions = [];

	this.processEntity = function (entity, state, delta, entities) {
    var fsmComp = smx.fsm(entity);

    var transition = function (nextState) { // Shift
      fsm[currentState].exit();
      fsmComp.stateTime = 0;
      fsmComp.currentState = nextState;
      fsm[nextState].enter(entity.components);
    };

    if (fsmComp) {
      var fsm = this.machineMapping[fsmComp.fsmName];
      if (!fsmComp.currentState) {
        fsmComp.currentState = fsm.states[0];
      }
      var currentState = fsmComp.currentState;
      fsmComp.stateTime += delta;

      while (this.queuedTransitions.length) {
        var next = this.queuedTransitions.splice(0, 1)[0];
        if (next.currentState === currentState && fsmComp.stateTime > 0.25) {
          transition(next.nextState);
        }
      }

      fsm[currentState].update(fsmComp.stateTime, transition);

      sm.gfx.text(
          sm.utils.formatters.float_one_pt(fsmComp.stateTime),
          0, 64
      );
    }
	};

	this.post = function () {

	};
	
	this.event = function (event) {
	  var machines = Object.keys(this.machineMapping);

	  var that = this;
    machines.forEach(function (machineName) {
      var machine = that.machineMapping[machineName];
      var states = machine.states;
      states.forEach(function (stateOptionName) {
        var stateOption = machine[stateOptionName];
        var listeners = stateOption.listeners;
        if (listeners) {
          Object.keys(listeners).forEach(function (listenerName) {
            var nextState = listeners[listenerName];
            if (event.eventName === listenerName) {
              that.queuedTransitions.push({
                currentState: stateOptionName,
                nextState: nextState
              });
            }
          });
        }
      });
    });
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
