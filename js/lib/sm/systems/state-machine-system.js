function StateMachineSystem (config) {
	this.name = 'state-machine-system';
	this.config = config;

	this.filter = [
		ComponentType.stateMachine
	];
	
	this.process = function (entity, fire) {
		
	};
}