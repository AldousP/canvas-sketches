function SampleSystemA () {
	this.name = 'sample_A';
	this.active = true;

	// Defines which entities will be passed into the process function.
	this.filter = [
	  ComponentType.gameplay
	];
	
	this.process = function (entity, fire) {
    fire(entity, EventTypes.MOVE_BY, {
      x: 0,
      y: 0
    })
	};
}

function SampleSystemB () {
  this.name = 'sample_B';

  this.filter = [
    ComponentType.position
  ];

  this.process = function (entity, fire) {

  };
}