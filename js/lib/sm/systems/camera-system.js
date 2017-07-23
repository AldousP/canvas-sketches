'use strict';

function CameraSystem(ID) {
  this.ID = ID;
  this.name = 'camera';

  this.pre = function () {

  };

  this.processEntity = function (entity, state, delta, entities) {

  };

  this.post = function () {

  };

  this.listeners = {

  };

  this.actions = {
    updateCam: function (entity, position) {
      var cam = smx.cam(entity);
      cam.pos = cpyVec(position);
    }
  };
}
