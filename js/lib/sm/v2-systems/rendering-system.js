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
    var renderable = EX.renderable(entity);

    if (renderable) {
      if (pos) {
        sm.ctx.translate(pos.x, -pos.y);

        if (rot) {
          sm.ctx.rotate(rot);
        }

        if (polygon) {
          sm.gfx.setStrokeColor(sc.color.white);
          sm.gfx.drawPolygon(polygon);
        }

        if (entity.children) {
          entity.children.forEach(function (childID) {
            var child = mapper.store[childID];
            drawEntity(child, mapper);
          });

        }

        if (rot) {
          sm.ctx.rotate(-rot);
        }

        sm.ctx.translate(-pos.x, pos.y);
      }
    }
  }
}