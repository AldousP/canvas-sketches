'use strict';

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = 'Rendering';
  this.tmpVecA = new Vector();

  this.processEntity = function (entity, state, delta, entities, recursion) {
    var renderRoot = smx.renderRoot(entity);
    if (!renderRoot && !recursion) return 0;

    if (!recursion) {
      state.renderData = {
        positionSum : new Vector(),
        rotationSum : 0
      };
    } else {
      if (renderRoot) {
        sm.log.error('Redundant RenderRoot component found on [' + entity.ID + ']' + entity.name + ' expect bugs.')
      }
    }

    var pos = smx.pos(entity);
    var poly = smx.poly(entity);
    var rot = smx.rot(entity);
    var col = smx.col(entity);
    var clip = smx.clip(entity);
    var children = smx.children(entity);
    var cam = smx.cam(entity);
    var text = smx.text(entity);

    var priorPos = cpyVec(state.renderData.positionSum);
    var priorRot = state.renderData.rotationSum;

    if (rot) {
      state.renderData.rotationSum += rot;
    }

    if (pos) {
      addVecVec(state.renderData.positionSum,  rotVec(cpyVec(pos), priorRot ? priorRot : 0));
    }

    if (rot) {
      state.renderData.priorRot = rot;
    }

    if (col) {
      sm.gfx.setStrokeColor(col);
    }

    if (children) {
      if (cam) {
        sm.gfx.preDraw();
        sm.ctx.translate(cam.pos.x, cam.pos.y);
      }

      if (clip) {
        sm.gfx.clipPoly(poly, state.renderData.positionSum, state.renderData.rotationSum);
        sm.gfx.setFillColor(state.bgColor);
        sm.gfx.drawPolygon(poly, state.renderData.positionSum, true, state.renderData.rotationSum);
      }

      for (var i = 0; i < children.length; i++) {
        sm.gfx.preDraw();
        this.processEntity(entities[children[i]], state, delta, entities, true);
        sm.gfx.postDraw();
      }
    }

    if (text && pos) {
      if (text.conf) {
        sm.gfx.setTextConf(text.conf);
      }
      sm.gfx.text(
          text.strings,
          state.renderData.positionSum.x,
          state.renderData.positionSum.y,
          state.renderData.rotationSum);
    }

    if (cam) {
      sm.gfx.postDraw();
    }

    if (poly && pos) {
      sm.gfx.drawPolygon(poly, state.renderData.positionSum, false, state.renderData.rotationSum);
    }

    if (pos) {
      state.renderData.positionSum = priorPos;
    }

    if (rot) {
      state.renderData.rotationSum = priorRot;
    }
  };
}