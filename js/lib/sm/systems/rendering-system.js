'use strict';

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = 'Rendering';
  this.tmpVecA = new Vector();

  this.processEntity = function (entity, state, delta, entities, x, recursion) {
    var renderRoot = x.renderRoot(entity);
    if (!renderRoot && !recursion) return 0;

    if (!recursion) {
      state.renderData = {
        positionSum : new Vector(),
        rotationSum : 0
      };
    }

    var pos = x.pos(entity);
    var poly = x.poly(entity);
    var rot = x.rot(entity);
    var col = x.col(entity);
    var clip = x.clip(entity);
    var children = x.children(entity);

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

    if (col && renderRoot) {
      sm.gfx.setFillColor(col);
    } else {
      sm.gfx.setStrokeColor(col ? col : Color.yellow);
    }

    sm.gfx.drawPolygon(poly, state.renderData.positionSum, col && clip, state.renderData.rotationSum);
    if (clip && poly && pos) {
      sm.gfx.clipPoly(poly, state.renderData.positionSum, state.renderData.rotationSum);
    }

    if (children) {
      for (var i = 0; i < children.length; i++) {
        this.processEntity(entities[children[i]], state, delta, entities, x, true);
      }
    }

    if (pos) {
      state.renderData.positionSum = priorPos;
    }

    if (rot) {
      state.renderData.rotationSum = priorRot;
    }
  };

  this.extractors = {
    clip : function (entity) {
      return !!entity.components[ComponentType.clip];
    },

    pos : function (entity) {
      return entity.components[ComponentType.position] ? (entity.components[ComponentType.position].position) : null
    },

    children : function (entity) {
      return entity.components[ComponentType.children] ? (entity.components[ComponentType.children].children) : null
    },

    rot : function (entity) {
      var rot = entity.components[ComponentType.rotation];
      if (rot) {
        return rot.radians ? rot.rotation : rot.rotation / DEG_RAD;
      } else {
        return null;
      }
    },

    col : function (entity) {
      return entity.components[ComponentType.color] ? entity.components[ComponentType.color].color : null;
    },

    poly : function (entity) {
      return entity.components[ComponentType.polygon] ? entity.components[ComponentType.polygon].polygon : null;
    },

    par : function (entity, entities) {
      return entity.components[ComponentType.parent] ? entities[entity.components[ComponentType.parent].parentID] : null
    },

    renderRoot : function (entity) {
      return !!entity.components[ComponentType.renderroot];
    }
  };
}