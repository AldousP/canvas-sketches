function RenderingSystem () {
	this.name = 'rendering-system';

	this.filter = [
		ComponentType.renderable,
    ComponentType.position,
    ComponentType.polygon
	];
	
	var getComp = function (entity, type) {
    return entity.components[type];
  };
	
	this.process = function (entities, fire) {
    entities.forEach(function (entity) {
      var polygon = getComp(entity, ComponentType.polygon);
      var pos = getComp(entity, ComponentType.position);
      sm.gfx.setStrokeColor(sc.color.white);
      sm.gfx.drawPolygon(polygon.polygon, pos.position);
    })
	};
}