"use strict";

function ViewportSystem(ID) {
  this.ID = ID;
  this.name = "Viewport";
  this.componentFilter = [
    ComponentType.position,
    ComponentType.camera,
    ComponentType.viewport
  ];

  this.pre = function () {


  };

  this.processEntity = function (entity, state, delta) {
    var pos = entity.components[ComponentType.viewport].position;
    var w = entity.components[ComponentType.viewport].width;
    var h = entity.components[ComponentType.viewport].height;
    sm.gfx.setStrokeColor(Color.red);
    sm.gfx.drawRect(pos.x, pos.y, w, h, false, Align.center);
  };

  this.post = function () {
  }
}
