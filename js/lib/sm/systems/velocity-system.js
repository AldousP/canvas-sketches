function VelocitySystem () {
	this.name = 'velocity';
	this.tmp_vec = new SVec.Vector(0, 0);

	// Defines which entities will be passed into the process function.
	this.filter = [
		ComponentType.transform,
		ComponentType.velocity
	];

  this.process = function (entities, fire, delta, mapper) {
    var vel, pos, accl;

    var that = this;
	  entities.forEach(function (entity) {
	    vel = EX.vel(entity);
	    accl = EX.accl(entity);
	    pos = EX.transPos(entity);

	    if (vel) {
        if (accl) {
          SVec.addVecConst(vel, accl.x * delta, accl.y * delta);
        }

        if (pos) {
          SVec.addVecConst(pos, vel.x * delta, vel.y * delta);
        }

        var friction = entity.components[ComponentType.velocity].friction;

        if (friction !== 0) {
          SVec.setVec(that.tmp_vec, -vel.x, -vel.y);
          SVec.setMag(that.tmp_vec, friction * delta);
          SVec.addVecVec(vel, that.tmp_vec);
        }
      }
    });
	};

  var getComp = function (entity, type) {
		return entity.components[type];
	};
}