function SampleSystemA () {
	this.name = 'sample_A';
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

function SampleSystemB () {
  this.name = 'sample_B';

  this.filter = [
    ComponentType.position
  ];

  this.process = function (entity, fire) {

  };
}