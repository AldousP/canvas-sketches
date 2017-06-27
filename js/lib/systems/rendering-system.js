"use strict";

function RenderingSystem(ID, camera, view) {
  this.ID = ID;
  this.name = "Rendering";
  this.view = view;
  this.camera = camera;

  this.componentFilter = [
    ComponentType.position
  ];

  this.pre = function (state) {
    sm.gfx.preDraw();
    sm.gfx.clear(state.bgColor);
    sm.gfx.postDraw();
  };

  this.processEntity = function (entity, state) {

  };

  this.post = function () {

  };
}