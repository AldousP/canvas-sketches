function CollisionSystem () {
	this.name = 'collision';

	this.filter = [
		ComponentType.transform,
		ComponentType.collider
	];
	
	this.process = function (entities, fire) {
	  var col, pos;
	  entities.forEach(function (entity) {
	    col = entity.components[ComponentType.collider].volume;
	    pos = entity.components[ComponentType.transform].position;
	    if (col && pos) {

      }
    });
	};

  var getComp = function (entity, type) {
		return entity.components[type];
	};
}