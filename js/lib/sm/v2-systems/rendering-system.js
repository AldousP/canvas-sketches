function RenderingSystem () {
	this.name = 'rendering-system';

	this.filter = [
		ComponentType.renderroot
	];

  this.process = function (entities, fire, delta, mapper) {
    entities.forEach(function (entity) {
      drawEntity(entity, mapper);
    })
	};

	function drawEntity (entity, mapper) {
    var polygon = EX.rendPoly(entity);
    var pos = EX.transPos(entity);
    var rot = EX.transRot(entity);

    if (polygon && pos) {
      sm.gfx.setStrokeColor(sc.color.white);
      sm.gfx.drawPolygon(polygon, pos);

      if (entity.children) {
        sm.ctx.translate(pos.x, -pos.y);
        sm.ctx.rotate(rot);
        entity.children.forEach(function (childID) {
          var child = mapper.store[childID];
          drawEntity(child, mapper);
        });
        sm.ctx.rotate(-rot);
        sm.ctx.translate(-pos.x, pos.y);
      }
    }
  }
}