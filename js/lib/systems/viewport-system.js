"use strict";

function ViewportSystem(ID) {
  this.ID = ID;
  this.name = "Viewport";
  this.componentFilter = [
    ComponentType.position,
    ComponentType.viewport,
    ComponentType.camera
  ];

  this.pre = function () {

  };

  this.processEntity = function (entity, delta) {

    var pos = entity[ComponentType.viewport].position;
    var w = entity[ComponentType.viewport].width;
    var h = entity[ComponentType.viewport].height;
    // sm.gfx.setStrokeColor(Color.red);
    // sm.gfx.drawRect(pos.x, pos.y, w, h);
  };

  this.post = function () {

  }
}
