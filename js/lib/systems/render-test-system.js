"use strict";

function RenderTestSystem(ID, camera, view) {
  this.ID = ID;
  this.name = "Rendering";
  this.view = view;
  this.camera = camera;
  this.polygon = generatePolygon(12, sm.canvas.width / 4, 0);
  this.polygonPos = new Vector(0, 0);

  this.pre = function (state) {
    sm.gfx.preDraw();
    sm.gfx.clear(state.bgColor);
    sm.gfx.postDraw();
  };

  this.processEntity = function (entity, state, delta) {

  };

  this.post = function () {
    sm.gfx.setFillColor(Color.white);
    sm.gfx.setStrokeColor(Color.white);
    sm.gfx.drawRect(0, 0, 25, 25, false);
    sm.gfx.drawRect(0, 0, 50, 50, false, Align.center);
    sm.gfx.text(true, "(0, 0)", 0, 0, 8);
    sm.gfx.setStrokeWidth(2.5);
    sm.gfx.drawCircle(0, 0, 100);
    sm.gfx.setStrokeWidth(1.5);
    sm.gfx.drawCircle(0, 0, 75);
    sm.gfx.setStrokeWidth(1);
    sm.gfx.drawCircle(0, 0, 50);
    sm.gfx.drawPolygon(this.polygon, this.polygonPos);
    sm.gfx.postDraw();
  };
}