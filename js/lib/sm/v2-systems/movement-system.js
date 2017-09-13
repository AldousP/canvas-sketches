function MovementSystem () {
	this.name = 'movement-system';

	// Defines which entities will be passed into the process function.
	this.filter = [
		ComponentType.position,
		ComponentType.movement
	];
	
	this.process = function (entities, fire) {
	  console.log(entities);

	};

  var getComp = function (entity, type) {
		return entity.components[type];
	};

	this.listeners = {
  	moveBy: {
  		type: EventTypes.MOVE_BY,
			handle: function (data, target) {
  			var pos = getComp(target, ComponentType.position);
  			SVec.addVecConst(pos.position, data.x, data.y);
      }
		},
		moveTo: {
			type: EventTypes.MOVE_TO,
			handle: function (data, target) {
				var pos = getComp(target, ComponentType.position);
				SVec.setVec(pos.position, data.x, data.y);
			}
		}
	}
}