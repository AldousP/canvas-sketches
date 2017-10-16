/**
 * Renders polygons, sprites, animations, particles and text.
 */
function RenderingSystem () {
  'use strict';

	this.name = 'rendering-system';

	this.filter = [
		ComponentType.renderroot
	];

  this.process = function (entities, fire, delta, mapper) {
    entities.forEach(function (entity) {
      drawEntity(entity, mapper, 1);
    })
	};

	function drawEntity (entity, mapper, parentOpacity) {
    var polygon = EX.rendPoly(entity);
    var pos = EX.transPos(entity);
    var rot = EX.transRot(entity);
    var renderable = EX.renderable(entity);
    var renderableVec = EX.renderableVec(entity);
    var textData = EX.text(entity);

    if (renderable && !renderable.disabled) {
      if (pos) {
        var opacity = renderable.opacity;
        if (opacity !== 0) {
          sm.ctx.translate(pos.x, -pos.y);

          if (opacity) {
            parentOpacity *= opacity;
          }

          if (rot) {
            sm.ctx.rotate(rot);
          }

          if (renderableVec) {
            sm.gfx.setStrokeColor2(renderableVec.color);
            sm.gfx.setStrokeWidth(renderableVec.stroke_width);
            sm.gfx.drawVec(renderableVec.vector);
          }

          if (polygon) {
            var stroke = entity.components[ComponentType.polygon].stroke;
            var fill = entity.components[ComponentType.polygon].fill;

            if (stroke) {
              stroke.a *= parentOpacity;
              sm.gfx.setStrokeWidth(2);
              sm.gfx.setStrokeColor2(stroke);
            } else {
              sm.gfx.setStrokeColor2(sc.color.clear);
            }

            // todo: expose configuration for this.
            if (fill) {
              fill.a *= parentOpacity;
              sm.gfx.setFillColor2(fill);
              sm.gfx.drawPolygon(polygon, null, true);
            } else {
              sm.gfx.drawPolygon(polygon, null, false);
            }

            if (stroke) {
              stroke.a /= parentOpacity;
            }

            if (fill) {
              fill.a /= parentOpacity;
            }
          }

          if (textData) {
            sm.gfx.setTextConf(textData.conf);
            sm.gfx.text(textData.strings, 0, 0, 0, parentOpacity);
          }

          if (entity.children) {
            entity.children.forEach(function (childID) {
              var child = mapper.store[childID];
              if (child) {
                drawEntity(child, mapper, parentOpacity);
              }
            });
          }

          if (opacity) {
            parentOpacity /= opacity;
          }

          if (rot) {
            sm.ctx.rotate(-rot);
          }

          sm.ctx.translate(-pos.x, pos.y);
        }
      }
    }
  }
}