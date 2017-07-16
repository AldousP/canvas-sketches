'use strict';

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = 'Rendering';
  this.tmpVecA = new Vector();

  this.processEntity = function (entity, state, delta, entities, x) {
    var poly = x.poly(entity);
    var pos = x.pos(entity);
    var rot = x.rot(entity);
    var col = x.col(entity);
    var parent = x.par(entity, entities);
    var tree = [];

    if (poly && pos) {
      if (parent) {
        while (parent) {
          var currentPos = x.pos(parent);
          var currentRot = x.rot(parent);
          var currentParent = x.par(parent, entities);
          var currentParentRot = 0;

          if (currentParent) {
            currentParentRot = x.rot(currentParent);
          }

          tree.push({
            pos : currentPos ? cpyVec(currentPos) : new Vector(),
            rot : currentRot ? currentRot : 0,
            parentRot : currentParentRot
          });
          parent = x.par(parent, entities);
        }
      }

      var baseVector = new Vector();
      var baseRot = 0;
      for (var i = tree.length - 1; i >= 0; i --) {
        var layer = tree[i];

        if (layer.pos) {
          if (baseRot) {
            addVecVec(baseVector, rotVec(layer.pos, baseRot));
          } else {
            addVecVec(baseVector, layer.pos);
          }
        }

        if (layer.rot) {
          baseRot += layer.rot;
        }
      }

      var posCopy = cpyVec(pos);
      if (baseRot) {
        rotVec(posCopy, baseRot);
      }
      addVecVec(baseVector, posCopy);
      sm.gfx.setStrokeColor(col);
      sm.gfx.drawPolygon(poly, baseVector, false, baseRot + rot);
    }
  };


  this.extractors = {
    pos : function (entity) {
      return entity.components[ComponentType.position] ? (entity.components[ComponentType.position].position) : null
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
      return entity.components[ComponentType.color] ? entity.components[ComponentType.color].color : "#FFFFFF";
    },

    poly : function (entity) {
      return entity.components[ComponentType.polygon] ? entity.components[ComponentType.polygon].polygon : null;
    },

    par : function (entity, entities) {
      return entity.components[ComponentType.parent] ? entities[entity.components[ComponentType.parent].parentID] : null
    }
  };
}