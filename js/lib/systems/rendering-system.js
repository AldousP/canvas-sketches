'use strict';

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = 'Rendering';
  this.tmpVec = new Vector();

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
    if (poly) {
      sm.gfx.setFillColor(Color.green);
      sm.gfx.setStrokeColor(Color.green);
      sm.gfx.drawPolygon(poly.polygon, pos ? pos.position : this.tmpVec, false);
    }
  };

  this.post = function () {

  };
}