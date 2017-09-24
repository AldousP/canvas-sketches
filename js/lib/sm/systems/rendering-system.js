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
      drawEntity(entity, mapper);
    })
	};

	function drawEntity (entity, mapper) {
    var polygon = EX.rendPoly(entity);
    var pos = EX.transPos(entity);
    var rot = EX.transRot(entity);
    var renderable = EX.renderable(entity);
    var renderableVec = EX.renderableVec(entity);
    var textData = EX.text(entity);

    if (renderable && !renderable.disabled) {
      if (pos) {
        sm.ctx.translate(pos.x, -pos.y);

        if (rot) {
          sm.ctx.rotate(rot);
        }

        if (renderableVec) {
          sm.gfx.setStrokeColor(renderableVec.color);
          sm.gfx.setStrokeWidth(renderableVec.stroke_width);
          sm.gfx.drawVec(renderableVec.vector);
        }

        if (polygon) {
          var stroke = entity.components[ComponentType.polygon].stroke;
          var fill = entity.components[ComponentType.polygon].fill;
          sm.gfx.setStrokeColor(stroke ? stroke : 'rgba(0, 0, 0, 0)');
          // todo: expose configuration for this.
          sm.gfx.setStrokeWidth(2);
          if (fill) {
            sm.gfx.setFillColor(fill);
            sm.gfx.drawPolygon(polygon, null, true);
          } else {
            sm.gfx.drawPolygon(polygon);
          }
        }

        if (textData) {
          sm.gfx.setTextConf(textData[1]);
          sm.gfx.text(textData[0], 0, 0);
        }

        // todo: port this animation logic
        // var sheetIndex = -1;
        // if (anim && pos) {
        //   sheetIndex = this.sheetNames.indexOf(anim.handle);
        //   if (sheetIndex < 0) {
        //     this.loadData(anim.handle, state);
        //   } else {
        //     this.drawAnimation(
        //       this.sheetFiles[sheetIndex],
        //       anim.progress,
        //       pos.x,
        //       pos.y,
        //       anim.width,
        //       anim.height,
        //       state.renderData.rotationSum,
        //       anim.flipped
        //     );
        //   }
        // }
        //
        // if (animMap && pos) {
        //   var conf = animMap.animationMap;
        //   var animations = conf.animations;
        //   var activeAnimation = animations[animMap.activeState];
        //   var file = activeAnimation.file;
        //
        //   sheetIndex = this.sheetNames.indexOf(file);
        //   if (sheetIndex < 0) {
        //     this.loadData(file, state);
        //   } else {
        //     this.drawAnimation(
        //       this.sheetFiles[sheetIndex],
        //       animMap.progress,
        //       pos.x,
        //       pos.y,
        //       activeAnimation.width,
        //       activeAnimation.height,
        //       state.renderData.rotationSum,
        //       activeAnimation.flipped
        //     );
        //   }
        // }

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