function SampleSystemA () {
	this.name = 'sample_A';
	this.active = true;

	// Defines which entities will be passed into the process function.
	this.filter = [
	  // ComponentType.position
	];
	
	this.process = function (entity, fire) {
	  fire(entity.ID, {
	    msg: 'Hello Event Queue.'
    });
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