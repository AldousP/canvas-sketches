'use strict';

function CameraSystem(ID) {
  this.ID = ID;
  this.name = 'Camera';

  this.pre = function () {

  };

  this.processEntity = function (entity, state, delta, entities) {
    var cam = smx.cam(entity);
    var path = smx.path(entity);

    if (cam && path) {
      this.actions.updateCam(entity, path.pos)
    }
  };

  this.post = function () {

  };

  this.handlers = {

  };

  this.actions = {
    updateCam: function (entity, position) {
      var cam = smx.cam(entity);

      cam.pos = cpyVec(position);
    }
  };
}
