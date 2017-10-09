function StateMachineSystem (config) {
	this.name = 'state-machine-system';
	this.config = config;

	this.filter = [
		ComponentType.stateMachine
	];

  this.process = function (entities, fire, delta, mapper) {

  };
	
	this.listeners = {
    _all: {
      type: '_all',
      handle: function (data, target, delta, mapper, fire) {
        console.log('Heard from ')
      }
    }
	}
}