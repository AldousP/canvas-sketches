function PongSystem () {
	this.name = 'pong_system';
	this.active = true;

	// Defines which entities will be passed into the process function.
	this.filter = [
	  ComponentType.gameplay
	];

	this.setup = function () {
    
  };
	
  var fired = false;
	this.process = function (entities, fire, delta) {
	  entities.forEach(function (entity) {

    });
	};
}