function RenderingSystem () {
	this.name = 'rendering-system';

	this.filter = [
		ComponentType.renderable,
    ComponentType.position,
    ComponentType.polygon
	];
	
	this.getComp = function (entity, type) {
    return entity.components[type];
  };
	
	this.process = function (entity, fire) {
		var polygon = this.getComp(entity, ComponentType.polygon);
    var pos = this.getComp(entity, ComponentType.position);

    sm.gfx.setStrokeColor(sc.color.white);
    sm.gfx.drawPolygon(polygon.polygon, pos.position);
	};
}