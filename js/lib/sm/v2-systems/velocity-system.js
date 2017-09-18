function VelocitySystem () {
	this.name = 'velocity';

	// Defines which entities will be passed into the process function.
	this.filter = [
		ComponentType.transform,
		ComponentType.velocity
	];

  this.process = function (entities, fire, delta, mapper) {
    var vel, pos, accl;

	  entities.forEach(function (entity) {
	    vel = EX.vel(entity);
	    accl = EX.accl(entity);
	    pos = EX.transPos(entity);

	    if (vel && accl) {
	      SVec.addVecConst(vel, accl.x * delta, accl.y * delta);
      }

	    if (vel && pos) {
        SVec.addVecConst(pos, vel.x * delta, vel.y * delta);
      }
    });
	};

  var getComp = function (entity, type) {
		return entity.components[type];
	};
}