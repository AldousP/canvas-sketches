'use strict';

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = 'Rendering';
  this.tmpVecA = new Vector();
  this.tmpVecB = new Vector();

  this.componentFilter = [
    ComponentType.position
  ];

  this.pre = function (state) {
    sm.gfx.preDraw();
    sm.gfx.clear(state.bgColor);
  };

  this.processEntity = function (entity, state, delta) {
    var poly = entity.components[ComponentType.polygon];
    var pos = entity.components[ComponentType.position];
    var rot = entity.components[ComponentType.rotation];
    var parentPos = state.parentPos;

    if (poly && pos) {
      setVecVec(this.tmpVecA, pos.position);
      if (parentPos) {
        addVecVec(this.tmpVecA, parentPos);
      } else {
        setVecVec(this.tmpVecA, pos.position);
      }
      sm.gfx.setFillColor(Color.green);
      sm.gfx.setStrokeColor(Color.green);
      if (rot) {
        sm.gfx.drawPolygon(poly.polygon, this.tmpVecA, false, rot.rotation);
      } else {
        sm.gfx.drawPolygon(poly.polygon, this.tmpVecA, false);
      }
    }
  };

  this.post = function () {
    sm.gfx.postDraw();
  };
}