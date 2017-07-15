"use strict";

function MovementSystem(ID) {
	this.ID = ID;
	this.name = "Movement";
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities, x) {
    var rotMod = x.movRot(entity);
    var rotVec = x.movVec(entity);
    if (rotMod) {
      this.fireAction(Actions.rotate(entity, rotMod * delta));
    }
	};

	this.post = function () {

	};

  this.actions = {

	};

  this.extractors = {
    movVec : function (entity) {
      return entity.components[ComponentType.movement] ? (entity.components[ComponentType.movement].movementVec) : null
    },

    movRot : function (entity) {
      var mov = entity.components[ComponentType.movement];
      if (mov) {
        return mov.rotSpeed ? mov.rotSpeed : null;
      } else {
        return null;
      }
    }
  };
}
