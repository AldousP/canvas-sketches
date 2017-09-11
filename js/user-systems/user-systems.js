function SampleSystemA () {
	this.name = 'sample_A';
	this.active = true;

	// Defines which entities will be passed into the process function.
	this.filter = [
	  ComponentType.gameplay
	];
	
	this.process = function (entity, fire, delta) {
    fire(entity.ID, EventTypes.MOVE_TO, {
      x: sm.input.state.cursor.x,
      y: sm.input.state.cursor.y
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