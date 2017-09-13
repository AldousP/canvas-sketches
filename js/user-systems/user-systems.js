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

	  if (!fired && entities.length) {
	    fired = true;
      fire(entities[0].ID, EventTypes.MOVE_BY, {
        x: 10,
        y: 10
      }, {
        length: 2
      })
    }
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