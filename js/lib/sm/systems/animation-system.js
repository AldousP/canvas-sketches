'use strict';

function AnimationSystem(ID) {
	this.ID = ID;
	this.name = 'animation';

  this.processEntity = function (entity, state, delta, entities) {
    var anim = smx.anim(entity);
    if (anim) {
      anim.progress += delta;
      if (anim.progress > anim.length) {
        anim.progress = anim.length;
      }
    }
  };
}