function MovementSystem () {
	this.name = 'movement-system';

	// Defines which entities will be passed into the process function.
	this.filter = [
		ComponentType.position,
		ComponentType.movement
	];
	
	this.process = function (entity, fire) {

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
		}
	}
}