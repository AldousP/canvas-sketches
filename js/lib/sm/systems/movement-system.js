'use strict';

function MovementSystem(ID) {
	this.ID = ID;
	this.name = 'Movement';
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities) {
    var rotMod = smx.movRot(entity);
    var rotVec = smx.movVec(entity);

    if (rotMod) {
      this.fireAction(Actions.rotate(entity, rotMod * delta));
    }

    if (rotVec) {
      this.fireAction(Actions.move(entity, sclVec(cpyVec(rotVec), delta)));
    }
	};

	this.post = function () {

	};

  this.actions = {

	};
}
