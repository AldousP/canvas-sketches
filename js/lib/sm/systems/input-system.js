'use strict';

function InputSystem(ID) {
  this.ID = ID;
  this.name = 'Input';

  this.moveVec = new Vector(0, 0);
  this.movementSpeed = 10;

  this.processEntity = function (entity, state, delta, entities, x) {
    setVec(this.moveVec, 0, 0);
    if (entity.name === 'root') {
      if (sm.input.state.up) {
        addVecConst(this.moveVec, 0, -this.movementSpeed * delta);
      }

      if (sm.input.state.down) {
        addVecConst(this.moveVec, 0, this.movementSpeed * delta);
      }

      if (sm.input.state.left) {
        addVecConst(this.moveVec, -this.movementSpeed * delta, 0);
      }

      if (sm.input.state.right) {
        addVecConst(this.moveVec, this.movementSpeed * delta, 0);
      }

      if (this.moveVec.len) {
        this.fireAction(Actions.move(entity, sclVec(this.moveVec, delta)))
      }
    }
  };
}