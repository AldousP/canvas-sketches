'use strict';

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = 'Rendering';
  this.tmpVecA = new Vector();
  this.tmpVecB = new Vector();

  this.componentFilter = [
    ComponentType.position
  ];

  this.processEntity = function (entity, state, delta) {
    var poly = entity.components[ComponentType.polygon];
    var pos = entity.components[ComponentType.position];
    var rot = entity.components[ComponentType.rotation];
    var col = entity.components[ComponentType.color];
    var parentPos = state.parentPos;
    var rotMod = 0;

    if (poly && pos) {
      setVecVec(this.tmpVecA, pos.position);

      if (state.parentRot) {
        rotVec(this.tmpVecA, state.parentRot);
        rotMod = state.parentRot;
      }

      if (parentPos) {
        addVecVec(this.tmpVecA, parentPos);
      }

      sm.gfx.setFillColor(col ? col.color : Color.white);
      sm.gfx.setStrokeColor(col ? col.color : Color.white);

      if (rot) {
        sm.gfx.drawPolygon(poly.polygon, this.tmpVecA, false, (rot.radians ? rot.rotation : rot.rotation / DEG_RAD) + rotMod);
      } else {
        sm.gfx.drawPolygon(poly.polygon, this.tmpVecA, false, rotMod);
      }
    }
  };
}