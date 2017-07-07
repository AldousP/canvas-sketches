"use strict";

function PhysicsSystem(ID) {
	this.ID = ID;
	this.name = "Physics";
	this.componentFilter = [
		ComponentType.position,
		ComponentType.velocity
	];

	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta) {
		if (sm.state.paused) return;
		var vel = entity.components[ComponentType.velocity];
		if (vel) {
      vel = entity.components[ComponentType.velocity].velocity;
      addVecVec(entity.components[ComponentType.position].position, sclVec(cpyVec(vel), delta));
      if (entity.components[ComponentType.acceleration]) {
        var accl = entity.components[ComponentType.acceleration].acceleration;
        addVecVec(vel, sclVec(cpyVec(accl), delta));
      }
		}
	};

	this.post = function () {

	}
}
