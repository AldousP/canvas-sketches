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
    sm.gfx.postDraw();
  };

  this.processEntity = function (entity, state, delta) {
    var poly = entity.components[ComponentType.polygon];
    var pos = entity.components[ComponentType.position];
    var parentPos = state.parentPos;

    if (poly && pos) {
      setVecVec(this.tmpVecA, pos.position);
      if (parentPos) {
        // console.log('Parent Pos found by child ' + entity.ID + ' at ' + pos.position.x + ', ' + pos.position.y);
        addVecVec(this.tmpVecA, parentPos);
        // console.log('Adjusted Position is: ' + this.tmpVecA.x + ', ' + this.tmpVecA.y);
      } else {
        setVecVec(this.tmpVecA, pos.position);
      }
      sm.gfx.setFillColor(Color.green);
      sm.gfx.setStrokeColor(Color.green);
      sm.gfx.drawPolygon(poly.polygon, this.tmpVecA, false);
    }
  };

  this.post = function () {

  };
}