'use strict';

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = 'Rendering';
  this.tmpVecA = new Vector();
  this.tmpVecB = new Vector();

  this.processEntity = function (entity, state, delta, entities, x) {
    var poly = x.poly(entity);
    var pos = x.pos(entity);
    var rot = x.rot(entity);
    var col = x.col(entity);
    var parent = x.par(entity, entities);
    
    setVec(this.tmpVecA, 0, 0);

    if (poly && pos) {
      var rotation = rot ? rot : 0;
      while (parent) {
        var currPos = x.pos(parent);
        var currPar = x.par(parent, entities);
        var currRot = x.rot(parent);

        if (currPos) {
          addVecVec(this.tmpVecA, currPos);
        }

        if (currRot) {
          rotation += currRot;
        }

        if (currPar) {
          parent = currPar;
        } else {
          parent = null;
        }
      }

      setVecVec(this.tmpVecB, pos);
      var immediateParent = x.par(entity, entities);
      if (immediateParent) {
        var immediateRot = x.rot(immediateParent);
        if (immediateRot) {
          rotVec(this.tmpVecB, immediateRot);
        }
      }

      addVecVec(this.tmpVecA, this.tmpVecB);
      sm.gfx.setStrokeColor(col);
      sm.gfx.drawPolygon(poly, this.tmpVecA, false, rotation);
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