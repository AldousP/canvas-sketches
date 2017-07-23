'use strict';

function CameraSystem(ID) {
  this.ID = ID;
  this.name = 'Camera';

  this.pre = function () {

  };

  this.processEntity = function (entity, state, delta, entities) {
    var cam = smx.cam(entity);
    var path = smx.path(entity);
    var ball = entity.components.ball;

    if (ball) {
      var pos = smx.pos(entity);
      if (state.lastPathPos) {
        setVecVec(pos, state.lastPathPos);
      }
    }

    if (path) {
      state.lastPathPos = path.pos;
    }

    if (cam) {
      this.actions.updateCam(entity, state.lastPathPos);
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
