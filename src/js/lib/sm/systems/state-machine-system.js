function StateMachineSystem (config) {
	this.name = 'state-machine-system';
	this.config = config;

	this.filter = [
		ComponentType.stateMachine
	];

	this.shiftTo = function (newState, FSM_target) {
	  var FSM = EX.fsm(FSM_target);
	  var FSM_def = this.config[FSM.fsmName];
	  var curr_state = FSM_def.states[FSM.currentState];
	  var new_state_def = FSM_def.states[newState];

	  if (curr_state.exit) {
	   curr_state.exit();
    }

    if (!new_state_def) {
	    sm.log.error('New state ' + newState + ' does not exist on state def of ' + FSM.fsmName, 'FSMSystem')
    } else {
	    if (new_state_def.enter) {
	      new_state_def.enter();
      }
    }

    FSM.currentState = newState;
	  FSM.timeInState = 0;
  };

  var that = this;
  this.process = function (entities, fire, delta, mapper) {
    entities.forEach(function (entity) {
      var state_data = EX.fsm(entity);
      var FSM_def = that.config[state_data.fsmName];
      if (FSM_def) {
        // Set current state if there isn't one defined.
        if (!state_data.currentState) {
          state_data.currentState = Object.keys(FSM_def.states)[0]
        }

        if (!state_data.timeInState) {
          state_data.timeInState = 0;
        }

        var state_def = FSM_def.states[state_data.currentState];
        if (state_def) {
          state_data.timeInState += delta;
          state_def.process(entity, delta, state_data.timeInState, that.shiftTo.bind(that));
        }
      } else {
        sm.log.notify(
          'Attempted to process component with FSM ' + state_data.fsmName + ' but found no matching state',
          'FSMSystem'
        )
      }
    });
  };
	
	this.listeners = {
    _all: {
      type: '_all',
      handle: function (data, target, delta, mapper, fire, type) {
        var FSM_defs = Object.keys(that.config);

        var entities = mapper.map[ComponentType.stateMachine];

        // Iterate over state defs to determine which FSMs listen for this event.
        entities.forEach(function (ID) {
          var entity = mapper.store[ID];
          var state_data = EX.fsm(entity);
          var FSM_def = that.config[state_data.fsmName];
          var active_state = FSM_def.states[state_data.currentState];
          if (active_state.listeners[type]) {
            active_state.listeners[type](data, entity, that.shiftTo.bind(that));
          }
        })
      }
    }
	}
}