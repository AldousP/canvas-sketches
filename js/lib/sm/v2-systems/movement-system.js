function VelocitySystem () {
	this.name = 'velocity';

	// Defines which entities will be passed into the process function.
	this.filter = [
		ComponentType.transform,
		ComponentType.velocity
	];
	
	this.process = function (entities, fire) {
	  var vel, pos;
	  entities.forEach(function (entity) {
	    vel = entity.components[ComponentType.velocity].velocity;
	    pos = entity.components[ComponentType.transform].position;
	    if (vel && pos) {
        SVec.addVecVec(pos, vel);
      }
    });
	};

  var getComp = function (entity, type) {
		return entity.components[type];
	};
}